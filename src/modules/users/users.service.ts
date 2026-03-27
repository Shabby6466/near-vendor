import { InjectRepository } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserNotFoundException } from "./users.exception";
import { InvalidCredentialsException } from "@modules/auth/auth-utils/auth.exception";
import { UpdateUserDto } from "./dto/update-user.dto";


import { Injectable } from "@nestjs/common";
import { ResponseCode, UserRoles } from "@utils/enum";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getUser(id: string) {
        return await this.userRepo.findOne({ where: { id: id } });
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.getUser(id);
        if (!user) throw new UserNotFoundException();

        if (dto.fullName) user.fullName = dto.fullName;
        if (dto.phone) user.phone = dto.phone;
        if (dto.photoUrl) user.photoUrl = dto.photoUrl;
        if (dto.latitude) user.lastKnownLatitude = dto.latitude;
        if (dto.longitude) user.lastKnownLongitude = dto.longitude;

        await this.userRepo.save(user);
        return { success: true, message: "User updated successfully", user };
    }

    async updateUserRole(id: string, role: UserRoles) {
        const user = await this.getUser(id);
        if (!user) throw new UserNotFoundException();
        user.role = role;
        await this.userRepo.save(user);
        return true;
    }

    async findUserByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email: email } });
    }

    async findUserByEmailWithPassword(email: string) {
        return await this.userRepo.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne();
    }

    async saveUser(user: User) {
        return await this.userRepo.save(user);
    }


    async changePassword(user: any, oldPassword: string, newPassword: string) {
        const u = await this.userRepo.createQueryBuilder('user')
            .where('user.id = :id', { id: user.id })
            .addSelect('user.password')
            .getOne();
        if (!u) throw new UserNotFoundException();

        const isMatch = await bcrypt.compare(oldPassword, u.password);
        if (!isMatch) throw new InvalidCredentialsException();

        u.password = await bcrypt.hash(newPassword, 10);
        await this.userRepo.save(u);

        delete (u as any).password;
        return { success: true, statusCode: ResponseCode.SUCCESS };
    }

    async deleteAccount(user: any, password: string) {
        const u = await this.userRepo.createQueryBuilder('user')
            .where('user.id = :id', { id: user.id })
            .addSelect('user.password')
            .getOne();
        if (!u) throw new UserNotFoundException();

        const isMatch = await bcrypt.compare(password, u.password);
        if (!isMatch) throw new InvalidCredentialsException();

        u.isActive = false;
        await this.userRepo.save(u);
        await this.userRepo.softDelete(u.id);

        return { success: true, message: "Account deleted successfully" };
    }
}