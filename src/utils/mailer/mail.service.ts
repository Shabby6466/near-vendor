import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { email_auth } from './templates/email_auth';


@Injectable()
export class MailService {

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  /**
   * Send verification code email to user on signup
   * @param recipientEmail - User's email address
   * @param verificationCode - The verification code to send
   */
  public async sendEmailVerificationCode(recipientEmail: string, verificationCode: string): Promise<void> {
    const senderEmail = this.configService.get<string>('MAILER_SENDER_EMAIL') || "no-reply@nearvendor.pro";
    const senderName = this.configService.get<string>('MAILER_SENDER_NAME') || "NearVendor";


    const msg = {
      to: recipientEmail,
      from: {
        email: senderEmail,
        name: senderName,
      },
      subject: 'Email Authentication',
      text: `Your verification code is: ${verificationCode}`,
      html: email_auth(verificationCode),
    };

    try {
      const response = await sgMail.send(msg);
      console.log("SendGrid response code:", response[0].statusCode);
    } catch (err) {
      console.error("SendGrid error details:", JSON.stringify(err, null, 2));
      const errorMsg = err.response?.body?.errors?.[0]?.message || err.message || JSON.stringify(err);
      throw new Error(`Failed to send verification email via SendGrid: ${errorMsg}`);
    }
  }

}
