import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../models/entities/users.entity';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepo;
    constructor(jwtService: JwtService, userRepo: Repository<User>);
    getUser(id: string): Promise<User>;
    createToken(user: any, expiryTime?: number | string | null, subject?: string): Promise<{
        expiresIn: string | number;
        accessToken: string;
        user: any;
    }>;
}
