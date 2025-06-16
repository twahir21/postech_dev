import nodemailer from "nodemailer";

export const sendMagicLink = async ({ frontendURL, link, email }: { frontendURL: string; link: string, email: string }) => {
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

    await transporter.sendMail({
    from: `"myPosTech" <${zohoEmail}>`,
    to: email,
    subject: "Hakiki barua pepe",
    html: `
        <!DOCTYPE html>
        <html lang="sw">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Thibitisha Barua Pepe</title>
        <style>
            body {
            font-family: 'Quicksand', sans-serif;
            background-color: #e2e8f0;
            padding: 1rem;
            color: #1f2937;
            font-size: 14px;
            margin: 0;
            }
            .container {
            max-width: 28rem;
            margin: 0 auto;
            background: white;
            border: 2px solid #334155;
            border-radius: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            }
            .header {
            text-align: center;
            padding: 2rem 1.5rem;
            background: linear-gradient(to top, #8324f0, #163ce7);
            }
            .header img {
            width: 5rem;
            margin: 0 auto 1rem;
            }
            .header h2 {
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
            }
            .content {
            padding: 2rem 1.5rem;
            text-align: center;
            }
            .content p {
            margin-bottom: 1.5rem;
            font-size: 14px;
            }
            .content a {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border: 2px solid #334155;
            background-color: #c7bbfc;
            color: #111827;
            font-weight: bold;
            border-radius: 9999px;
            text-decoration: none;
            }
            .footer {
            margin-top: 2rem;
            font-size: 12px;
            color: #6b7280;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <img src="${frontendURL}/thumbail.png" alt="App Logo">
                <h2>Thibitisha Barua Pepe Yako</h2>
            </div>
            <div class="content">
            <p>Habari! Tafadhali bonyeza kitufe hapa chini kuthibitisha anwani yako ya barua pepe 
                <span style="color: #ef4444;">kabla ya dakika 20</span>.
            </p>
            <a href="${link}">Thibitisha Barua Pepe</a>
            <div class="footer">
                <p>Ikiwa hukutuma ombi la akaunti au ujumbe huu, tafadhali puuza barua pepe hii.</p>
            </div>
            </div>
        </div>
        </body>
        </html>
    `
});
}