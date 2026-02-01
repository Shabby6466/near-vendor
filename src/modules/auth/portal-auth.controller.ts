import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "@modules/users/dto/users.dto";
import { UserService } from "@modules/users/users.service";
import { UserRoles } from "@utils/enum";
import { InvalidPortalRoleException } from "./role-login.exception";

@ApiTags("PortalAuth")
@Controller()
export class PortalAuthController {
  constructor(private readonly users: UserService) {}

  @Post("admin/login")
  @ApiOperation({ summary: "Admin login (SUPERADMIN only)" })
  async adminLogin(@Body() dto: LoginDto) {
    const res: any = await this.users.login(dto);
    if (res?.user?.role !== UserRoles.SUPERADMIN) {
      throw new InvalidPortalRoleException();
    }
    return res;
  }

  @Post("vendor/login")
  @ApiOperation({ summary: "Vendor login (VENDOR only)" })
  async vendorLogin(@Body() dto: LoginDto) {
    const res: any = await this.users.login(dto);
    if (res?.user?.role !== UserRoles.VENDOR) {
      throw new InvalidPortalRoleException();
    }
    return res;
  }
}
