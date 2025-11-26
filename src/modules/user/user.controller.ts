import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { NoUserFoundException } from "./user.exceptions";
import { User } from "./entities/user.entity";
import { CurrentUser } from "@modules/common/decorator/current-user.decorator";

@Controller("user")
@ApiTags("User")
@ApiCookieAuth()
@ApiBearerAuth()
export class UserController {
  constructor(private readonly service: UserService) { }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get user stats" })
  @ApiOkResponse({ description: "User stats" })
  async getUser(@CurrentUser() user: User) {
    if (!user) throw new NoUserFoundException();
    return this.service.getUser(user.id);
  }
}

