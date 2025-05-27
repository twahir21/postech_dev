import nodemailer from "nodemailer";
import "dotenv/config";
import { Elysia } from "elysia";
import { sanitizeString } from "../../functions/security/xss";
import { emailData } from "../../functions/security/validators/data";

const zohoEmail = "huduma@mypostech.store";

let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", 
    port: 465, // Use 465 for SSL or 587 for TLS
    secure: true, // true for 465 (SSL), false for 587 (TLS)
    auth: {
        user: zohoEmail,
        pass: process.env.ZOHO_APP_PASSWORD,
    },
});

export const mailPlugin = new Elysia();

interface email {
    name: string;
    email: string;
    message: string;
}

mailPlugin.post("/sendMail", async ({ body }: { body: email }) => {
    try {
        let { name, email, message } = body as email;

        name = sanitizeString(name);
        email = sanitizeString(email);
        message = sanitizeString(message);

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Sehemu zote zinahitajika",
                }),
                { status: 400 }
            );
        }

        await transporter.sendMail({
            from: `"${name}" <${zohoEmail}>`,
            to: process.env.TO_EMAIL,
            subject: "myPosTech message",
            html: `
            <!DOCTYPE html>
            <html lang="sw">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contact Form Submission</title>
            </head>
            <body>
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #0056b3; font-size: 18px; margin-bottom: 20px;">New Contact Form Submission</h2>
                    <p style="margin: 0 0 10px 0;">
                        <strong style="font-weight: bold; color: #555555;">Name:</strong> <span style="font-weight: normal;">${name}</span>
                    </p>
                    <p style="margin: 0 0 10px 0;">
                        <strong style="font-weight: bold; color: #555555;">Email:</strong> <span style="font-weight: normal; color: #007bff;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></span>
                    </p>
                    <p style="margin: 0 0 10px 0;">
                        <strong style="font-weight: bold; color: #555555;">Message:</strong>
                    </p>
                    <p style="margin: 0 0 10px 0; padding: 10px; border: 1px solid #dddddd; background-color: #ffffff;">
                        ${message}
                    </p>
                    <p style="font-size: 12px; color: #888888; margin-top: 20px;">
                        This email was sent from your website's contact form.
                    </p>
                </div>
            </body>
            </html>
            `
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Ujumbe wako umetumwa kiukamilifu!",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Email Error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Imeshindwa kutuma barua pepe",
            }),
            { status: 500 }
        );
    }
}, {
    body: emailData
});
