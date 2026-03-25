import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'models/entities/users.entity';
import { InvalidCredentialsException } from './auth.exception';
import { InvalidOtpException, InvalidRoleException, PhoneNumberAlreadyExistsException, UserNotFoundException } from '@modules/users/users.exception';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, LoginDto } from '@modules/users/dto/users.dto';
import { UserService } from '@modules/users/users.service';
import { ResponseCode, ResponseMessage, UserRoles } from '@utils/enum';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) { }

    async createToken(
        user: any,
        expiryTime?: number | string | null,
        subject?: string,
    ) {
        return {
            expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRES_IN,
            accessToken: this.jwtService.sign(
                { uuid: user?.id, role: user?.role },
                {
                    secret: process.env.JWT_SECRET,
                    subject: subject ? subject : '',
                    expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRES_IN,
                },
            ),
            user,
        };
    }
    async createUser(dto: CreateUserDto) {
        console.log(dto);

        // Check if user already exists
        const existingUser = await this.userService.findUserByEmail(dto.email);
        if (existingUser) {
            throw new PhoneNumberAlreadyExistsException();
        }

        if (dto.role != UserRoles.BUYER && dto.role != UserRoles.VENDOR) {
            throw new InvalidRoleException();
        }
        const otp = await this.otpService.generateOtp(dto.email, dto);
        // Generate and send OTP, caching the DTO
        // await this.otpService.sendOtp(dto.email, dto);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: "OTP sent to email. Please verify to complete registration.",
            otp
        };
    }
    async verifyAndCreateUser(email: string, otp: string) {
        // Verify OTP
        const isOtpValid = await this.otpService.verifyOtp(email, otp);
        if (!isOtpValid) {
            throw new InvalidOtpException();
        }

        // Retrieve cached DTO
        const dto = await this.otpService.getPendingData<CreateUserDto>(email);
        if (!dto) {
            throw new InvalidOtpException(); // Or a custom "Registration Expired" exception
        }

        // Officially create the user
        const user = new User();
        user.fullName = dto.fullName;
        user.email = dto.email;
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        user.password = hashedPassword;
        user.lastKnownLatitude = dto.latitude;
        user.lastKnownLongitude = dto.longitude;
        user.role = dto.role;

        await this.userService.saveUser(user);

        // Clear OTP and cached data
        await this.otpService.clearOtp(email);

        const tokenData = await this.createToken(user);
        delete user.password;
        return {
            success: true,
            statusCode: ResponseCode.CREATED_SUCCESSFULLY,
            message: ResponseMessage.SUCCESS,
            user,
            token: tokenData.accessToken,
            mustChangePassword: (user as any).mustChangePassword || false,
        };
    }
    async login(dto: LoginDto) {
        const user = await this.userService.findUserByEmail(dto.email)
        if (!user) {
            throw new UserNotFoundException();
        }
        if ((user as any).isActive === false) {
            throw new InvalidCredentialsException();
        }
        const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatched) {
            throw new InvalidCredentialsException();
        }
        const tokenData = await this.createToken(user);
        delete user.password;
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: ResponseMessage.SUCCESS,
            user,
            token: tokenData.accessToken,
            mustChangePassword: (user as any).mustChangePassword || false,
        };
    }

}