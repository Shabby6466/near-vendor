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

    async createUser(dto: CreateUserDto) {
        console.log(dto);
        const user = new User();
        user.fullName = dto.fullName;
        if (dto.phoneNumber) {
            const existingUser = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
            if (existingUser) {
                throw new PhoneNumberAlreadyExistsException();
            }
        }
        user.phoneNumber = dto.phoneNumber;
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
        const user = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
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