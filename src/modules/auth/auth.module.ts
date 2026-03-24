import { Module } from "@nestjs/common";
import { UsersModule } from "@modules/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { OtpService } from "./otp.service";
import { MailModule } from "@utils/mailer/mail.module";



@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule { }
