"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = exports.MailSubjects = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
var MailSubjects;
(function (MailSubjects) {
    MailSubjects["Admin_Account_Invitation"] = "Admin Account Invitation";
    MailSubjects["Admin_Reset_Password"] = "Reset Your Admin Password";
})(MailSubjects || (exports.MailSubjects = MailSubjects = {}));
const templates_1 = require("./templates");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    static configureSendGrid() {
        return {
            transport: {
                service: 'sendgrid',
                host: 'smtp.sendgrid.net',
                secure: false,
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY,
                },
            },
            defaults: {
                from: process.env.SENDGRID_EMAIL,
            },
        };
    }
    sendEmailVerificationCode(email, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentYear = new Date().getFullYear();
            try {
                yield this.mailerService.sendMail({
                    to: email,
                    subject: 'Email Verification',
                    html: `<html lang="en">
<head>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet" type="text/css">
</head>
<body style="background: linear-gradient(180deg, #710093 0%, #960CBF 100%);">
<table bgcolor="#710093" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" align="center">
<tbody><tr>
<td bgcolor="#710093" style="background: linear-gradient(180deg, #710093 0%, #960CBF 100%);" valign="top" align="center" class="m_6069702506707232563pd_10">

<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
<tbody><tr>
<td align="center" valign="top">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" class="m_6069702506707232563table" style="width:100%;max-width:600px">

<tbody><tr>
<td align="center" valign="top" class="m_6069702506707232563table" style="padding-top:20px;padding-left: 30px;padding-right: 30px;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">

<tbody><tr>
<td aria-hidden="true" align="center" valign="top" style="padding:20px 0">
<img style="width:166px;display:block" src="https://i.imgur.com/8hsc8Vv.png" width="166" border="0">
</td>
</tr><tr>
<td align="center" valign="top">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
<tbody><tr>
<td align="center" valign="top">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr>
<td style="border-left:1px solid #e5e7e8;border-right:1px solid #e5e7e8;border-top:1px solid #eff1f2;border-bottom:1px solid #e5e7e8;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr>
<td style="border-left:1px solid #e0e2e3;border-right:1px solid #e0e2e3;border-top:1px solid #eefof1;border-bottom:1px solid #e0e2e3;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr>
<td style="border-left:1px solid #dbdddd;border-right:1px solid #dbdddd;border-top:1px solid #eceeef;border-bottom:1px solid #dbdddd;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr>
<td style="border-left:1px solid #d5d7d8;border-right:1px solid #d5d7d8;border-top:1px solid #e9ebec;border-bottom:1px solid #d5d7d8;border-collapse:collapse;border-radius:8px" align="center" bgcolor="#F8F9FA" valign="top" width="100%">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr>
<td style="border-radius: 8px;border-collapse:collapse" width="100%" bgcolor="#ffffff">
<table role="presentation" border="0" cellpadding="0" cellspacing="0">

<tbody>
<tr>
<td align="left" valign="top" style="padding:40px">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width: 600px;">
<tbody><tr>
<td align="left" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#1f1f1f;padding-bottom:15px;text-align: center;">
<h2>Email Verification Code</h2>
</td>
</tr>
<tr>
<td class="m_6069702506707232563pd_r0" align="left" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#1f1f1f;padding-bottom:15px;padding-right:0px">
<p>Dear User </p>
<p>
This code remains valid for 3 minutes. Please do not disclose it to anyone (including staff)
  </p>
</td>
</tr>
<tr>
<td align="center" valign="middle" style="background-color:#710093;border-radius:4px;color:#ffffff;font-size:16px;line-height:24px;font-family:Google Sans,Roboto,Arial,Helvetica,sans-serif;font-weight:500;border-top:12px solid #710093;border-right:24px solid #710093;border-bottom:12px solid #710093;border-left:24px solid #710093;text-decoration:none;display:block">
${verificationCode}
</td>
</tr>
      <tr>
        <td align="left" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#1f1f1f;padding-top:15px">
          <strong>Thank You,<br>
          DEVENT
</tbody></table>
</td>
</tr>

</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
<tr>
<td aria-hidden="true" align="center" valign="top" style="font-size:14px;line-height:24px;font-family:Rubik,Open Sans,Arial,sans-serif;color:#fff;padding:10px">
Copyright © ${currentYear} DEVENT. All rights reserved.
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</body>
</html>
              `,
                });
            }
            catch (err) {
                throw new Error(`Failed to send verification email: ${err.message}`);
            }
        });
    }
    sendMail(mailInfo) {
        const { data, from, subject, template, to } = mailInfo;
        const html = { data: templates_1.templates[template] };
        Object.entries(data).forEach(([key, value]) => (html.data = html.data.replace(`{{${key}}}`, value)));
        return this.mailerService.sendMail({ to, from, subject, html: html.data });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map