import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { UsersController } from "./users.controller";
import { AuthService } from "@modules/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@modules/auth/jwt-strategy";
import { CacheModule } from "@nestjs/cache-manager";
import { MailModule } from "@utils/mailer/mail.module";
import { OtpService } from "@modules/auth/otp.service";
import * as redisStore from "cache-manager-redis-store";


@Module(
    {
        imports: [
            TypeOrmModule.forFeature([User]),
            MailModule,
            CacheModule.register({
                store: redisStore,
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                db: parseInt(process.env.REDIS_DB || process.env.BULL_REDIS_DB || '0', 10),
                password: process.env.REDIS_PASSWORD,
            }),

            JwtModule.registerAsync({
                imports: [],
                useFactory: () => {
                    return {
                        secret: process.env.JWT_SECRET,
                        signOptions: {
                            ...(process.env.JWT_EXPIRES_IN
                                ? {
                                    expiresIn: process.env.JWT_EXPIRES_IN,
                                }
                                : {}),
                        },
                    };
                },
                inject: [],
            }),
            PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        providers: [UserService, AuthService, JwtStrategy, OtpService],

        controllers: [UsersController],
        exports: [UserService, AuthService, JwtStrategy, PassportModule, OtpService],

    }
)
export class UsersModule { }