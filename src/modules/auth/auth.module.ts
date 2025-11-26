import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "@modules/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { CacheManagerModule } from "@modules/cache-manager/cache-manager.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategey";
import { AuthService } from "./auth.service";
import { User } from "@modules/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    UserModule,
    CacheManagerModule,
    PassportModule.register({ defaultStrategy: ["jwt"] }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: {
            ...(process.env.JWT_EXPIRATION_TIME
              ? {
                  expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
              : {}),
          },
        };
      },
      inject: [],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule.register({ defaultStrategy: "jwt" })],
})
export class AuthModule {}
