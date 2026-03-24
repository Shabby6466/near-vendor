import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { email_auth } from './templates/email_auth';


@Injectable()
export class MailService {
  private mailerSend: MailerSend;

  constructor(private configService: ConfigService) { }

  private getClient() {
    if (!this.mailerSend) {
      this.mailerSend = new MailerSend({
        apiKey: this.configService.get<string>('MAILER_API_KEY'),
      });
    }
    return this.mailerSend;
  }

  /**
   * Send verification code email to user on signup
   * @param email - User's email address
   * @param verificationCode - The verification code to send
   */
  public async sendEmailVerificationCode(recipientEmail: string, verificationCode: string): Promise<void> {
    const senderEmail = this.configService.get<string>('MAILER_SENDER_EMAIL') || "no-reply@nearvendor.pro";
    const senderName = this.configService.get<string>('MAILER_SENDER_NAME') || "NearVendor";


    const sentFrom = new Sender(senderEmail, senderName);
    const recipients = [
      new Recipient(recipientEmail, "User")
    ];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Email Authentication")
      .setHtml(email_auth(verificationCode))
      .setText(`Your verification code is: ${verificationCode}`);

    try {
      const response = await this.getClient().email.send(emailParams);
      console.log("Mailersend response:", response);
    } catch (err) {
      console.error("Mailersend full error:", JSON.stringify(err, null, 2));
      // Re-throw with more details if possible
      const errorMsg = err.message || (err.body ? JSON.stringify(err.body) : JSON.stringify(err));
      throw new Error(`Failed to send verification email: ${errorMsg}`);
    }
  }

}
