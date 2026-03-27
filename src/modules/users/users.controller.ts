import { Body, Controller, Post, UseGuards, Req, Delete, Get, Patch } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto, LoginDto, VerifyOtpDto } from "./dto/users.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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

    @Patch("update")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Update user profile" })
    @ApiOkResponse({ description: "User updated successfully" })
    async updateUser(@Body() dto: UpdateUserDto, @Req() req: any) {
        return await this.service.updateUser(req.user.id, dto);
    }

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

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Get current user" })
    @ApiOkResponse({ description: "User found successfully" })
    async getMe(@Req() req: any) {
        return await this.service.getUser(req.user.id);
    }
}