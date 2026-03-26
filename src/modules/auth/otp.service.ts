import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OtpRecord } from 'models/entities/otp.entity';
import { MailService } from '@utils/mailer/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpRecord)
    private readonly otpRepo: Repository<OtpRecord>,
    private mailService: MailService,
  ) { }

  async generateOtp(email: string, data?: any): Promise<string> {
    const normalizedEmail = email.toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.otpRepo.delete({ email: normalizedEmail });

    const record = this.otpRepo.create({
      email: normalizedEmail,
      otp: hashedOtp,
      data: data ?? null,
      expiresAt,
    });
    await this.otpRepo.save(record);

    return otp;
  }

  async sendOtp(email: string, data?: any): Promise<void> {
    const otp = await this.generateOtp(email, data);
    await this.mailService.sendEmailVerificationCode(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();

    // Find a non-expired OTP record for this email
    const record = await this.otpRepo.findOne({
      where: {
        email: normalizedEmail,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!record) {
      console.warn(`[OtpService] No active OTP record found in DB for email: "${normalizedEmail}"`);
      return false;
    }

    // Compare plaintext OTP against the stored hash
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      console.warn(`[OtpService] OTP mismatch for email: "${normalizedEmail}"`);
    }
    return isMatch;
  }

  async getPendingData<T>(email: string): Promise<T | null> {
    const normalizedEmail = email.toLowerCase();
    const record = await this.otpRepo.findOne({
      where: {
        email: normalizedEmail,
        expiresAt: MoreThan(new Date()),
      },
    });
    return record?.data ?? null;
  }

  async clearOtp(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    await this.otpRepo.delete({ email: normalizedEmail });
  }
}
