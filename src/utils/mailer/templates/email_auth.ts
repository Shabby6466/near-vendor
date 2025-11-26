const html = String.raw;
export const email_auth = html`
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
            <svg width="180" height="60" viewBox="0 0 300 100">
                <!-- Blue cross/plus symbol -->
                <path d="M30,20 L45,5 L60,20 L75,5 L90,20 L75,35 L90,50 L75,65 L60,50 L45,65 L30,50 L45,35 Z" fill="#0077cc"/>
                
                <!-- nearvendor text -->
                <text x="110" y="45" font-family="Arial, sans-serif" font-size="30" font-weight="bold">nearvendor</text>
                
                <!-- Tagline -->
                <text x="110" y="65" font-family="Arial, sans-serif" font-size="11">TOKENIZING YOUR EMOTION</text>
            </svg>
        </div>
        
        <div class="content">
            <h2>Device Authentication</h2>
            
            <p>Just one more step to authenticate your identity. Simply tap the 'Authenticate' button below from the device where your app is installed.</p>
            
            <div class="device-info">
                <div class="device-row">
                    <div class="device-label">Location:</div>
                    <div class="device-value">{{Location}}</div>
                </div>
                <div class="device-row">
                    <div class="device-label">Time:</div>
                    <div class="device-value">{{GMTTime}} (GMT)</div>
                </div>
                <div class="device-row">
                    <div class="device-label">IP:</div>
                    <div class="device-value">{{IP}}</div>
                </div>
                <div class="device-row">
                    <div class="device-label">Device:</div>
                    <div class="device-value">{{Device}}</div>
                </div>
            </div>
            
            <p style="margin: 30px 0; text-align: center;">
                <a href="{{AuthLink}}" style="color: white;"  class="button" target="_blank">Authenticate</a>
            </p>
            
            <p>If you did not attempt to log in, please ignore this email or contact our support team immediately.</p>
            
            <p>Best regards,</p>
            <p>The nearvendor Team</p>
        </div>
        
         
    </div>
</body>
</html>
`;
