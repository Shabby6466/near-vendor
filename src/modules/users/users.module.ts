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

@Module(
    {
        imports: [
            TypeOrmModule.forFeature([User]),
            JwtModule.registerAsync({
                imports: [],
                useFactory: () => {
                    return {
                        secret: process.env.JWT_SECRET_KEY,
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
        providers: [UserService, AuthService, JwtStrategy],
        controllers: [UsersController],
        exports: [UserService, AuthService, JwtStrategy, PassportModule],
    }
)
export class UsersModule { }