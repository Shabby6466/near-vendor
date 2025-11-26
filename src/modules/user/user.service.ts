import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { NoUserFoundException } from "./user.exceptions";
import { CreateUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  /**
   *
   * @param address
   * @returns
   */
  async findByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email: email } });
    if (!user) {
      const newUser = new User();
      newUser.email = email;
      await this.repo.save(newUser);
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.password = dto.password;
    user.userName = dto.userName;
    user.role = dto.role;
    await this.repo.save(user);
    return user;
  }

  /**
   *
   * @param id
   * @returns
   */
  async get(id: string) {
    return this.repo.findOne({ where: { id } });
  }
  async getUser(userId: string) {

    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NoUserFoundException();
    }
    return {
      ...user,
    };
  }
}
