import { UserRoles } from "@utils/enum";
export declare class CreateUserDto {
    fullName: string;
    phoneNumber: string;
    password: string;
    latitude: number;
    longitude: number;
    role: UserRoles;
}
export declare class LoginDto {
    phoneNumber: string;
    password: string;
}
