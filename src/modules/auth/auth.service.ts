import { CreateUserDto } from "@modules/user/dto/user.dto";
import { User } from "@modules/user/entities/user.entity";
import { UserService } from "@modules/user/user.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService
  ) { }

  /**
   *
   * @param payload
   * @returns
   */
  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(dto);

      const { accessToken } = this.createToken(user);
      return { token: accessToken, user };
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  async getUser(userId: string) {
    return this.userService.getUser(userId);
  }

  /**
   *
   * @param user
   * @param expiryTime
   * @param subject
   * @returns
   */
  createToken(
    user: User,
    expiryTime?: number | string | null,
    subject?: string
  ) {
    return {
      expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRATION_TIME,
      accessToken: this.jwtService.sign(
        { uuid: user?.id, email: user.email },
        {
          subject: subject ? subject : "",
          expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRATION_TIME,
        }
      ),
      user,
    };
  }
}
