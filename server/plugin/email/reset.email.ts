import nodemailer from "nodemailer";

export const sendResetEmail = async ({ email, link }: { email: string; link: string }) => {
  const zohoEmail = "huduma@mypostech.store";

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="sw">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Badilisha Nenosiri</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
        .header { text-align: center; padding-bottom: 20px; }
        .header h2 { margin: 0; color: #1a202c; }
        .content p {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #44464d;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          text-align: center;
          color: #a0aec0;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-container .logo {
          max-width: 70px;
          height: auto;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="http://localhost:5173/newLogo.webp" alt="PosTech Logo" class="logo">
        </div>
        <div class="header">
          <h2>Ombi la Kubadili Nenosiri</h2>
        </div>
        <div class="content">
          <p>Habari,</p>
          <p>
            Ulituma ombi la kubadili nenosiri kwa akaunti yako kwenye
            <strong>MyPostech</strong>. Ikiwa hili halikuwa wewe, unaweza kupuuza barua hii.
          </p>
          <p>Bonyeza kitufe hapa chini kubadili nenosiri lako:</p>
          <a href="{{RESET_LINK}}" class="button">Badilisha Nenosiri</a>
          <p>
            Link hii itatimia ndani ya dakika 15 kwa sababu za kiusalama.
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 MyPostech. Haki zote zimehifadhiwa.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const html = htmlTemplate.replace("{{RESET_LINK}}", link);

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
    subject: "Badilisha Nenosiri - MyPostech",
    html,
  });
};
