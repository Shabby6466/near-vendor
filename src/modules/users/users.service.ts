import { InjectRepository } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserNotFoundException } from "./users.exception";
import { InvalidCredentialsException } from "@modules/auth/auth.exception";


import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getUser(id: string) {
        return await this.userRepo.findOne({ where: { id: id } });
    }

    async findUserByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email: email } });
    }

    async saveUser(user: User) {
        return await this.userRepo.save(user);
    }


    async changePassword(user: any, oldPassword: string, newPassword: string) {
        const u = await this.userRepo.findOne({ where: { id: user.id } });
        if (!u) throw new UserNotFoundException();

        const isMatch = await bcrypt.compare(oldPassword, u.password);
        if (!isMatch) throw new InvalidCredentialsException();

        u.password = await bcrypt.hash(newPassword, 10);
        (u as any).mustChangePassword = false;
        await this.userRepo.save(u);

        delete (u as any).password;
        return { success: true, user: u };
    }
}