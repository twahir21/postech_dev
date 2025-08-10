import nodemailer from "nodemailer";

export const sendDailyReportEmail = async ({ email, shopName }: { email: string; shopName: string; }) => {
  const zohoEmail = "huduma@mypostech.store";

    const html = `
    <!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ripoti ya siku ya Leo</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        
        /* Email Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Header */
        .header {
            background-color: #2c3e50;
            color: white;
            padding: 25px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        
        .date {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 8px;
        }
        
        /* Content */
        .content {
            padding: 25px;
        }
        
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        /* Summary Cards */
        .summary-card {
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .sales-card {
            background-color: #e8f5e9;
            border-left: 4px solid #2e7d32;
        }
        
        .expenses-card {
            background-color: #ffebee;
            border-left: 4px solid #c62828;
        }
        
        .profit-card {
            background-color: #e3f2fd;
            border-left: 4px solid #1565c0;
        }
        
        .card-label {
            font-weight: 600;
            font-size: 16px;
        }
        
        .card-value {
            font-weight: 700;
            font-size: 18px;
        }
        
        .profit-positive {
            color: #2e7d32;
        }
        
        .profit-negative {
            color: #c62828;
        }
        

        
        /* Footer */
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        
        .footer a {
            color: #3498db;
            text-decoration: none;
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
        
        /* Responsive */
        @media screen and (max-width: 480px) {
            .email-container {
                border-radius: 0;
            }
            
            .summary-card {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .card-value {
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="https://www.mypostech.store/newLogo.webp" alt="PosTech Logo" class="logo">
            </div>
            <h1>Ripoti ya Faida ya Leo</h1>
            <div class="date" id="current-date">Jumatatu, 12 Juni 2023</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Habari ${shopName},<br>
                Hii ni ripoti ya miamala yako ya leo:
            </div>
            
            <!-- Summary Cards -->
            <div class="summary-card sales-card">
                <span class="card-label">Mauzo</span>
                <span class="card-value">TSh 1,250,000/=</span>
            </div>
            
            <div class="summary-card expenses-card">
                <span class="card-label">Matumizi</span>
                <span class="card-value">TSh 350,000/=</span>
            </div>
            
            <div class="summary-card profit-card">
                <span class="card-label">Faida</span>
                <span class="card-value profit-positive">TSh 900,000/=</span>
            </div>
        
        </div>
        
        <div class="footer">
            <p>Kama kuna hitilafu yoyote, tafadhali wasiliana nasi kupitia 0674291587</p>
            <p>© 2025 MyPosTech. Biashara yako, Teknolojia yetu.</p>
        </div>
    </div>

    <script>
        // Set current date in Swahili format
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('sw-TZ', dateOptions);
        document.getElementById('current-date').textContent = currentDate;
    </script>
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
