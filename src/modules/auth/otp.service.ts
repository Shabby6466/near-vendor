import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from '@utils/mailer/mail.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
  ) {}

  async generateOtp(email: string, data?: any): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in cache for 5 minutes
    await this.cacheManager.set(`otp_${email}`, otp, 300000);
    if (data) {
      await this.cacheManager.set(`data_${email}`, data, 300000);
    }
    return otp;
  }

  async sendOtp(email: string, data?: any): Promise<void> {
    const otp = await this.generateOtp(email, data);
    await this.mailService.sendEmailVerificationCode(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.cacheManager.get(`otp_${email}`);
    if (storedOtp === otp) {
      // Don't delete yet as we might need the data
      return true;
    }
    return false;
  }

  async getPendingData<T>(email: string): Promise<T | null> {
    return await this.cacheManager.get<T>(`data_${email}`);
  }

  async clearOtp(email: string): Promise<void> {
    await this.cacheManager.del(`otp_${email}`);
    await this.cacheManager.del(`data_${email}`);
  }
}
