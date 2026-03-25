import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto, LoginDto, VerifyOtpDto } from "./dto/users.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
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

    @Post("change-password")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Change password (first login / security)" })
    @ApiOkResponse({ description: "Change password" })
    async changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
        return await this.service.changePassword(req.user, dto.oldPassword, dto.newPassword);
    }
}