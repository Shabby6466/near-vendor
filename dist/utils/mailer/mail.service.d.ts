import { MailerService } from '@nestjs-modules/mailer';
export declare enum MailSubjects {
    Admin_Account_Invitation = "Admin Account Invitation",
    Admin_Reset_Password = "Reset Your Admin Password"
}
export interface MailInfo {
    to: string;
    from: string;
    subject: MailSubjects;
    template: keyof typeof templates;
    data: object;
}
import { templates } from './templates';
interface SendGridConfig {
    transport: {
        service: string;
        host: string;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    defaults: {
        from: string;
    };
}
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    static configureSendGrid(): SendGridConfig;
    sendEmailVerificationCode(email: string, verificationCode: string): Promise<void>;
    sendMail(mailInfo: Required<MailInfo>): Promise<SentMessageInfo>;
}
export {};
