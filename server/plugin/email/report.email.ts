import nodemailer from "nodemailer";

export const sendDailyReportEmail = async ({ email, shopName }: { email: string; shopName: string; }) => {

    // Set current date in Swahili format with TypeScript
    const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
    };

    const currentDate: string = new Date().toLocaleDateString('sw-TZ', dateOptions);

  const zohoEmail = "huduma@mypostech.store";

    const html = `
    <!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ripoti ya Faida ya Leo</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f5f5; color:#000;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden;">

    <!-- Header -->
    <div style="padding:20px; text-align:center; border-bottom:1px solid #ddd;">
      <img src="https://www.mypostech.store/newLogo.webp" alt="PosTech Logo" style="max-width:80px; height:auto; display:block; margin:0 auto;">
      <h1 style="margin:10px 0 5px; font-size:20px; font-weight:600;">Ripoti ya Faida ya Leo</h1>
      <p style="margin:0; font-size:14px; color:#555;">${currentDate}</p>
    </div>

    <!-- Content -->
    <div style="padding:20px;">
      <p style="margin:0 0 20px; font-size:15px;">Habari ${shopName},<br>
      Hii ni ripoti ya miamala yako ya leo:</p>

      <div style="margin-bottom:12px; padding:12px; border:1px solid #ddd; border-radius:6px;">
        <strong>Mauzo:</strong>
        <span style="float:right;">TSh 1,250,000/=</span>
      </div>

      <div style="margin-bottom:12px; padding:12px; border:1px solid #ddd; border-radius:6px;">
        <strong>Matumizi:</strong>
        <span style="float:right;">TSh 350,000/=</span>
      </div>

      <div style="padding:12px; border:1px solid #ddd; border-radius:6px;">
        <strong>Faida:</strong>
        <span style="float:right; color:green;">TSh 900,000/=</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:15px; text-align:center; font-size:13px; color:#555; border-top:1px solid #ddd;">
      <p style="margin:0;">Kama kuna hitilafu yoyote, tafadhali wasiliana nasi kupitia 0674291587</p>
      <p style="margin:5px 0 0;">© 2025 MyPosTech. Biashara yako, Teknolojia yetu.</p>
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
    subject: "Ripoti ya siku - MyPostech",
    html,
  });
};
