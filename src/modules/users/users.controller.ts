import { Body, Controller, Post, UseGuards, Req, Delete } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto, LoginDto, VerifyOtpDto } from "./dto/users.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
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

    @Delete("delete-account")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Delete account (Soft delete)" })
    @ApiOkResponse({ description: "Account deleted successfully" })
    async deleteAccount(@Body() dto: DeleteAccountDto, @Req() req: any) {
        return await this.service.deleteAccount(req.user, dto.password);
    }
}