import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ResponseMessage } from "@utils/enum";
import { SuccessValidate } from "@modules/user/user.response";
import { Response } from "express";
import { CreateUserDto, GetUserDto, GetUserByEmailDto } from "@modules/user/dto/user.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post("create")
  @ApiOperation({ summary: "Create a user" })
  @ApiOkResponse({
    description: ResponseMessage.SUCCESS,
    type: SuccessValidate,
  })
  async create(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, token } = await this.service.createUser(data);
    res.status(HttpStatus.OK);
    return new SuccessValidate({ user, token });
  }

  @Post("get")
  @ApiOperation({ summary: "Get a user" })
  @ApiOkResponse({
    description: ResponseMessage.SUCCESS,
    type: SuccessValidate,
  })
  async getUser(
    @Body() data: GetUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.service.getUser(data.userId);
    res.status(HttpStatus.OK);
    return user;
  }

  @Post("getByEmail")
  @ApiOperation({ summary: "Get user by email" })
  @ApiOkResponse({
    description: ResponseMessage.SUCCESS,
    type: SuccessValidate,
  })
  async getUserByEmail(
    @Body() data: GetUserByEmailDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.service.getUserByEmail(data.email);
    res.status(HttpStatus.OK);
    return user;
  }
}
