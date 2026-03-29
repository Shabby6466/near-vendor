import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto, LoginDto, VerifyOtpDto } from "@modules/users/dto/users.dto";
import { UserService } from "@modules/users/users.service";
import { UserRoles } from "@utils/enum";
import { InvalidPortalRoleException } from "./auth-utils/role-login.exception";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("create")
  @ApiOperation({ summary: "Create a new user" })
  @ApiOkResponse({ description: "Create a new user" })
  async createUser(@Body() dto: CreateUserDto) {
    return await this.authService.createUser(dto);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Verify OTP and complete registration" })
  @ApiOkResponse({ description: "User created successfully" })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return await this.authService.verifyAndCreateUser(dto.email, dto.otp);
  }



  @Post("/login")
  @ApiOperation({ summary: "Login" })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
