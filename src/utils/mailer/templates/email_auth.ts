const html = String.raw;
export const email_auth = (verificationCode: string) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nearvendor Email - Authentication</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .logo {
            width: 180px;
            height: auto;
        }
        .content {
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .footer {
            padding: 20px 0;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #0077cc;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: #0077cc;
        }
        .device-info {
            background: #f5f8fd;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        .device-row {
            display: flex;
            margin-bottom: 10px;
        }
        .device-label {
            width: 30%;
            font-weight: bold;
        }
        .device-value {
            width: 70%;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
                
                <!-- nearvendor text -->
                <text x="110" y="45" font-family="Arial, sans-serif" font-size="30" font-weight="bold">Nearvendor</text>
                
            </svg>
        </div>
        
        <div class="content">
            <h2>Email Authentication</h2>
            
            <p>Just one more step to authenticate your identity. Simply tap the 'Authenticate' button below from the device where your app is installed.</p>
            
            <p style="margin: 30px 0; text-align: center;">
                <a style="color: white;" class="button" target="_blank">${verificationCode}</a>
            </p>
            
            <p>If you did not attempt to log in, please ignore this email or contact our support team immediately.</p>
            
            <p>Best regards,</p>
            <p>The Nearvendor Team</p>
        </div>
        
         
    </div>
</body>
</html>
`;

