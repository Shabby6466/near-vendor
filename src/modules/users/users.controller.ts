import { Body, Controller, Post, Get, Param, Query, Req, } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto, LoginDto } from "./dto/users.dto";
import {
    ApiBearerAuth,
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
@Controller("users")
@ApiTags("Users")
@ApiCookieAuth()
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly service: UserService) { }

    @Post("create")
    @ApiOperation({ summary: "Create a new user" })
    @ApiOkResponse({ description: "Create a new user" })
    async createUser(@Body() dto: CreateUserDto) {
        return await this.service.createUser(dto);
    }

    @Post("login")
    @ApiOperation({ summary: "Login" })
    @ApiOkResponse({ description: "Login" })
    async login(@Body() dto: LoginDto) {
        return await this.service.login(dto);
    }
}