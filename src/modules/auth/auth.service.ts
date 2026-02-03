import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'models/entities/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getUser(id: string) {
        const user = await this.userRepo.findOne({ where: { id } });
        return user;
    }
    async createToken(
        user: any,
        expiryTime?: number | string | null,
        subject?: string,
    ) {
        return {
            expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRES_IN,
            accessToken: this.jwtService.sign(
                { uuid: user?.id },
                {
                    secret: process.env.JWT_SECRET,
                    subject: subject ? subject : '',
                    expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRES_IN,
                },
            ),
            user,
        };
    }
}