import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { UsersController } from "./users.controller";


@Module(
    {
        imports: [
            TypeOrmModule.forFeature([User]),
        ],
        providers: [UserService],

        controllers: [UsersController],
        exports: [UserService],

    }
)
export class UsersModule { }