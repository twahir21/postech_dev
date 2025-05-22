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
      return { success: false, message: "Shop not found." };
    }

    const logoPath = process.env.QR_LOGO_PATH || "./default-path";
    const zip = new AdmZip();
    const tempFiles: string[] = [];

    // Ensure output directory exists once at the top
    await fs.mkdir("./images", { recursive: true });

    for (const product of productList) {

      const priceBoughtDb = await mainDb
        .select({ priceBought: purchases.priceBought })
        .from(purchases)
        .where(eq(purchases.productId, product.id));

      const priceBought = priceBoughtDb[0]?.priceBought;

      const sanitizedShopName = shopName.replace(/[^a-zA-Z0-9-_]/g, "_");
      const sanitizedName = product.name.replace(/[^a-zA-Z0-9-_]/g, "_");
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

        // Only if success
        zip.addLocalFile(outputPath, "", fileName);
        tempFiles.push(outputPath);

    }

    // Write zip file
    const zipFileName = `qrcodes_${Date.now()}.zip`;
    const zipFilePath = `./${zipFileName}`;
    zip.writeZip(zipFilePath);

    // Mark products as having QR
    await mainDb
      .update(products)
      .set({ isQRCode: true })
      .where(eq(products.isQRCode, false));

    // Read zip as buffer
    const zipFileBuffer = await fs.readFile(zipFilePath);

    // Cleanup QR images
    for (const path of tempFiles) {
      await fs.unlink(path).catch((err) =>
        console.error(`Failed to delete ${path}:`, err)
      );
    }

    // ✅ Delete the zip file itself
    await fs.unlink(zipFilePath).catch((err) =>
      console.error(`Failed to delete zip file ${zipFilePath}:`, err)
    );

    
    // Set response headers
    set.headers["Content-Type"] = "application/zip";
    set.headers["Content-Disposition"] = `attachment; filename="${zipFileName}"`;

    return zipFileBuffer;
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