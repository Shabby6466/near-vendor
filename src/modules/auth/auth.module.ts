import { Module } from "@nestjs/common";
import { UsersModule } from "@modules/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { OtpService } from "./otp.service";
import { MailModule } from "@utils/mailer/mail.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./auth-utils/jwt-strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpRecord } from "models/entities/otp.entity";

@Module({
  imports: [
    UsersModule,
    MailModule,
    TypeOrmModule.forFeature([OtpRecord]),
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
