import { Module } from "@nestjs/common";
import { UsersModule } from "@modules/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { OtpService } from "./otp.service";
import { MailModule } from "@utils/mailer/mail.module";
import { CacheModule } from "@nestjs/cache-manager";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./auth-utils/jwt-strategy";
import * as redisStore from "cache-manager-redis-store";



@Module({
  imports: [
    UsersModule,
    MailModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: parseInt(process.env.REDIS_DB || process.env.BULL_REDIS_DB || '0', 10),
      password: process.env.REDIS_PASSWORD,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, JwtStrategy],
  exports: [AuthService, OtpService, JwtStrategy, PassportModule],
})
export class AuthModule { }
