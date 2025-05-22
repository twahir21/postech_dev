import QRCode from "qrcode";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export async function generateQRCodeWithLogo(data: string, logoPath: string, outputPath: string) {
    try {
        const qrSize = 500;
        const logoScale = 0.25;

        // Ensure output folder exists
        const outputDir = path.dirname(outputPath);
        await fs.mkdir(outputDir, { recursive: true });

        // Generate QR Code as a Buffer
        const qrCodeBuffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: "H",
            width: qrSize,
        });

        // Load and resize logo
        const logoSize = Math.floor(qrSize * logoScale);
        const logoBuffer = await fs.readFile(logoPath);
        const resizedLogo = await sharp(logoBuffer)
            .resize(logoSize, logoSize)
            .toBuffer();

        // Composite and save final image
        await sharp(qrCodeBuffer)
            .composite([{ input: resizedLogo, gravity: "center" }])
            .toFile(outputPath);

        return {
            success: true,
            message: `✅ QR Code saved to ${outputPath}`
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo kwenye seva wakati wa kutengeneza QR Code"
        };
    }
}
