import { InjectRepository } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto, LoginDto } from "./dto/users.dto";
import * as bcrypt from "bcryptjs";
import { InvalidRoleException, PhoneNumberAlreadyExistsException, UserNotFoundException } from "./users.exception";
import { AuthService } from "@modules/auth/auth.service";
import { InvalidCredentialsException } from "@modules/auth/auth.exception";
import { UserRoles } from "@utils/enum";

import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly authService: AuthService,
    ) { }

    private normalizePhone(phone: string): string {
        if (!phone) return "";
        // Remove all non-numeric characters
        let normalized = phone.replace(/\D/g, "");
        // If it starts with 00, replace with + (logic: leading 00 is often used for +)
        if (phone.startsWith("00")) normalized = normalized.substring(2);
        // Standardize leading 0 (e.g. for local numbers, add country code if missing - assuming UZ +998 for now given the context)
        // If it's 9 digits, assume it's local UZ and add 998
        if (normalized.length === 9) normalized = "998" + normalized;
        return normalized;
    }

    async createUser(dto: CreateUserDto) {
        console.log(dto);
        const user = new User();
        user.fullName = dto.fullName;
        const normalizedPhone = this.normalizePhone(dto.phoneNumber);
        if (normalizedPhone) {
            const existingUser = await this.userRepo.findOne({ where: { phoneNumber: normalizedPhone } });
            if (existingUser) {
                throw new PhoneNumberAlreadyExistsException();
            }
        }
        user.phoneNumber = normalizedPhone;
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        user.password = hashedPassword;
        user.lastKnownLatitude = dto.latitude;
        user.lastKnownLongitude = dto.longitude;

        if (dto.role != UserRoles.BUYER && dto.role != UserRoles.SELLER) {
            throw new InvalidRoleException();
        }
        user.role = dto.role;
        await this.userRepo.save(user);
        const tokenData = await this.authService.createToken(user);
        delete user.password;
        return {
            user,
            token: tokenData.accessToken,
            mustChangePassword: (user as any).mustChangePassword || false,
        };
    }

    async login(dto: LoginDto) {
        const normalizedPhone = this.normalizePhone(dto.phoneNumber);
        const user = await this.userRepo.findOne({ where: { phoneNumber: normalizedPhone } });
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
        const tokenData = await this.authService.createToken(user);
        delete user.password;
        return {
            user,
            token: tokenData.accessToken,
            mustChangePassword: (user as any).mustChangePassword || false,
        };
    }

    async changePassword(user: any, newPassword: string) {
        const u = await this.userRepo.findOne({ where: { id: user.id } });
        if (!u) throw new UserNotFoundException();

        u.password = await bcrypt.hash(newPassword, 10);
        (u as any).mustChangePassword = false;
        await this.userRepo.save(u);

        delete (u as any).password;
        return { success: true, user: u };
    }
}