import { UserService } from "./users.service";
import { CreateUserDto, LoginDto } from "./dto/users.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
export declare class UsersController {
    private readonly service;
    constructor(service: UserService);
    createUser(dto: CreateUserDto): Promise<{
        user: import("../../models/entities/users.entity").User;
        token: string;
        mustChangePassword: any;
    }>;
    login(dto: LoginDto): Promise<{
        user: import("../../models/entities/users.entity").User;
        token: string;
        mustChangePassword: any;
    }>;
    changePassword(dto: ChangePasswordDto, req: any): Promise<{
        success: boolean;
        user: import("../../models/entities/users.entity").User;
    }>;
}
