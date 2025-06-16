import nodemailer from "nodemailer";

export const notifyTrialEnd = async ({ email, shopName, link }: { email: string; shopName: string; link: string }) => {
  const zohoEmail = "huduma@mypostech.store";

  const html = `
    <!DOCTYPE html>
    <html lang="sw">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Muda umekwisha</title>
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
            <img src="https://www.mypostech.store/thumbail.png" alt="App Logo">
            <h2>Muda wa Jaribio Umeisha ⏳</h2>
        </div>
        <div class="content">
        <p>
            Habari <strong>"${shopName}"</strong>,
        </p>
        <p style="line-height: 1.6;">
            Jaribio lako la siku 14 kwenye <strong>myPosTech</strong> limeisha. Ili kuendelea kutumia mfumo na kuona ripoti, faida na kufanya mauzo, tafadhali boresha kifurushi chako sasa.
        </p>
        <p style="line-height:1.6;">
            Tunapendekeza kujiunga na kifurushi <strong>Lite</strong> au <strong>Business</strong> kulingana na ukubwa wa biashara yako.
        </p>
        <a href="${link}" target="_blank">Boresha Sasa</a>
        <div class="footer">
            <p>Asante kwa kutumia mfumo wetu. myPosTech - Biashara yako, Teknolojia yetu.</p>
        </div>
        </div>
    </div>
    </body>
    </html>
  `;


  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: zohoEmail,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"myPosTech" <${zohoEmail}>`,
    to: email,
    subject: "Kuisha muda wa siku 14 - MyPostech",
    html,
  });
};
