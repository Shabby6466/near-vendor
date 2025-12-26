import { InjectRepository } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto, LoginDto } from "./dto/users.dto";
import * as bcrypt from "bcrypt";
import { InvalidRoleException, PhoneNumberAlreadyExistsException, UserNotFoundException } from "./users.exception";
import { AuthService } from "@modules/auth/auth.service";
import { InvalidCredentialsException } from "@modules/auth/auth.exception";
import { UserRoles } from "@utils/enum";

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
            token: tokenData.accessToken
        };
    }

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
        if (!user) {
            throw new UserNotFoundException();
        }
        const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatched) {
            throw new InvalidCredentialsException();
        }
        const tokenData = await this.authService.createToken(user);
        delete user.password;
        return {
            user,
            token: tokenData.accessToken
        };
    }
}