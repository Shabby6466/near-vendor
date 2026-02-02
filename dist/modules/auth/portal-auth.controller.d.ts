import { LoginDto } from "../users/dto/users.dto";
import { UserService } from "../users/users.service";
export declare class PortalAuthController {
    private readonly users;
    constructor(users: UserService);
    adminLogin(dto: LoginDto): Promise<any>;
    vendorLogin(dto: LoginDto): Promise<any>;
}
