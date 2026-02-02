import { User } from "../../models/entities/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto, LoginDto } from "./dto/users.dto";
import { AuthService } from "../auth/auth.service";
export declare class UserService {
    private readonly userRepo;
    private readonly authService;
    constructor(userRepo: Repository<User>, authService: AuthService);
    createUser(dto: CreateUserDto): Promise<{
        user: User;
        token: string;
        mustChangePassword: any;
    }>;
    login(dto: LoginDto): Promise<{
        user: User;
        token: string;
        mustChangePassword: any;
    }>;
    changePassword(user: any, newPassword: string): Promise<{
        success: boolean;
        user: User;
    }>;
}
