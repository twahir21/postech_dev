import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import fs from "fs/promises"; // Use async file handling
import AdmZip from "adm-zip"; // For creating zip files
import dotenv from "dotenv";
import { extractId } from "../functions/security/jwtToken";
import { generateQRCodeWithLogo } from "../functions/qrCodeFunc";
import { mainDb } from "../database/schema/connections/mainDb";
import { products, purchases, shops, supplierPriceHistory } from "../database/schema/shop";
import { eq } from "drizzle-orm";
import { PDFDocument, rgb } from "pdf-lib";

dotenv.config();

const frontendURL = process.env.NODE_ENV === 'development'
                    ? process.env.FRONTEND_URL_DEV!
                    : process.env.FRONTEND_URL!

const {
  JWT_TOKEN,
} = process.env;

if (!JWT_TOKEN) {
  throw new Error("Missing required environment variables!");
}

// 🚀 QR Code API Route
const qrCodePlugin = new Elysia()
  .use(jwt({ name: "jwt", secret: JWT_TOKEN }))
  .get("/check-isQrCode", async ({ jwt, cookie }) => {
    try {
      const { userId, shopId } = await extractId({ jwt, cookie });
      if (!shopId || !userId) return;


      // Fetch all products where isQRCode is false
      const productList = await mainDb
        .select({
          isQrCode: products.isQRCode
        })
        .from(products)
        .where(eq(products.isQRCode, false));

      // Return early if no products require QR code generation
      if (productList.length === 0) {
        return { success: false, message: "Hakuna bidhaa ya kutengenezea QR Code" };
      }

      return { success: true, message: "Kuna bidhaa zimepatikana, zinahitaji QR Code" };
      
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kuangalia uhitaji wa QRCode" 
      };
    }
  })

.get("/generate-qrcode", async ({ jwt, cookie, set }) => {
  try {
    const { userId, shopId } = await extractId({ jwt, cookie });
    if (!shopId || !userId) return;

    const productList = await mainDb
      .select({
        id: products.id,
        name: products.name,
        priceSold: products.priceSold,
        supplierId: products.supplierId,
      })
      .from(products)
      .where(eq(products.isQRCode, false));

    const shopName = await mainDb
      .select({ name: shops.name })
      .from(shops)
      .where(eq(shops.id, shopId))
      .then((res) => res[0]?.name);

    if (!shopName) {
      return { success: false, message: "Duka halijapatikana." };
    }

    const logoPath = process.env.QR_LOGO_PATH || "./default-path";
    const tempFiles: string[] = [];

    // initialize pdf
    const pdfDoc = await PDFDocument.create();
    
    // PDF Page Settings
    // const QR_SIZE = 150; // pixels
    const MARGIN = 50;
    const GRID_COLS = 3;
    const GRID_ROWS = 4;
    let currentPage = pdfDoc.addPage([595, 842]); // A4 size (portrait)
    let currentRow = 0;
    let currentCol = 0;

    // Ensure output directory exists once at the top
    await fs.mkdir("./images", { recursive: true });

    for (const product of productList) {

      const priceBoughtDb = await mainDb
        .select({ priceBought: purchases.priceBought })
        .from(purchases)
        .where(eq(purchases.productId, product.id));

      const priceBought = priceBoughtDb[0]?.priceBought;

      const sanitizedShopName = shopName.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 27); // ensure not too long
      const sanitizedName = product.name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 27); // ensure not too long
      const fileName = `qrcode_${sanitizedShopName}_${sanitizedName}.png`;
      const outputPath = `./images/${fileName}`;

      const prodData = {
        product: {
          productId: product.id,
          priceSold: product.priceSold,
          supplierId: product.supplierId,
          name: product.name,
          quantity: 1,
          saleType: "cash",
          discount: 0,
          customerId: null,
          description: "Matumizi ya nyumbani",
          priceBought,
          generatedAt: new Date().toISOString(),
        },
      };

      const url = new URL(`${frontendURL}/scan-qrcode`);
      Object.entries(prodData.product).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });

      const data = url.toString();

      // Generate QR code to file
      const qrResult = await generateQRCodeWithLogo(data, logoPath, outputPath);

      if (!qrResult.success) {
        continue; // skip adding to zip
      }

      // Add to PDF
      const qrImage = await pdfDoc.embedPng(await fs.readFile(outputPath));


      // Make QR size responsive to page dimensions
      const QR_SIZE = Math.min(
        (currentPage.getWidth() - (GRID_COLS + 1) * MARGIN) / GRID_COLS,
        (currentPage.getHeight() - (GRID_ROWS + 1) * MARGIN) / GRID_ROWS
      );
      
      // Calculate position
      const x = MARGIN + (currentCol * (QR_SIZE + MARGIN));
      const y = currentPage.getHeight() - MARGIN - (currentRow + 1) * (QR_SIZE + MARGIN);
      
      currentPage.drawImage(qrImage, {
        x,
        y,
        width: QR_SIZE,
        height: QR_SIZE,
      });

      // Add product name below QR
      currentPage.drawText(product.name, {
        x: x + 10,
        y: y - 20,
        size: 10,
        color: rgb(0, 0, 0),
      });


      // Update grid position
      currentCol++;
      if (currentCol >= GRID_COLS) {
        currentCol = 0;
        currentRow++;
        
        // New page if grid full
        if (currentRow >= GRID_ROWS) {
          currentPage = pdfDoc.addPage([595, 842]);
          currentRow = 0;
          currentCol = 0;
        }
      }

      tempFiles.push(outputPath);


    }



    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);

      // Add to each page
      page.drawText(`Shop: ${shopName}`, {
        x: 50,
        y: 30,
        size: 12,
      });

      page.drawText(`Page ${i + 1}/${pageCount}`, {
        x: 500,
        y: 30,
        size: 10,
      });
    }

    // Mark products as having QR
    await mainDb
      .update(products)
      .set({ isQRCode: true })
      .where(eq(products.isQRCode, false));

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    

    // Cleanup QR images
    for (const path of tempFiles) {
      await fs.unlink(path).catch((err) =>
        console.error(`Failed to delete ${path}:`, err)
      );
    }

    // Set response headers for PDF
    set.headers["Content-Type"] = "application/pdf";
    set.headers["Content-Disposition"] = `attachment; filename="qrcodes_${Date.now()}.pdf"`;

    return new Uint8Array(pdfBytes);

  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Tatizo limetokea wakati wa kutengeneza QRCode",
    };
  }
});


export default qrCodePlugin;