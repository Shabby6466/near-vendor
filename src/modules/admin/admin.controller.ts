import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
import { RolesGuard } from "@modules/auth/roles.guard";
import { Roles } from "@modules/auth/roles.decorator";
import { UserRoles } from "@utils/enum";
import { AdminService } from "./admin.service";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRoles.SUPERADMIN)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get("vendor-applications")
  @ApiOperation({ summary: "List vendor applications" })
  listVendorApps(@Query("status") status?: string) {
    return this.service.listVendorApps(status);
  }

  @Get("vendor-applications/:id")
  @ApiOperation({ summary: "Get vendor application by id" })
  getVendorApp(@Param("id") id: string) {
    return this.service.getVendorApp(id);
  }

  @Post("vendor-applications/:id/approve")
  @ApiOperation({ summary: "Approve vendor application (creates vendor + shop)" })
  approve(@Param("id") id: string, @Req() req: any) {
    return this.service.approveVendorApp(id, req.user);
  }

  @Post("vendor-applications/:id/reject")
  @ApiOperation({ summary: "Reject vendor application" })
  reject(@Param("id") id: string, @Body() body: { reason: string }, @Req() req: any) {
    return this.service.rejectVendorApp(id, body?.reason, req.user);
  }

  @Post("shops/:id/disable")
  @ApiOperation({ summary: "Disable a shop" })
  disableShop(@Param("id") id: string) {
    return this.service.setShopActive(id, false);
  }

  @Post("shops/:id/enable")
  @ApiOperation({ summary: "Enable a shop" })
  enableShop(@Param("id") id: string) {
    return this.service.setShopActive(id, true);
  }

  @Post("inventory-items/:id/disable")
  @ApiOperation({ summary: "Disable an inventory item" })
  disableItem(@Param("id") id: string) {
    return this.service.setInventoryItemActive(id, false);
  }

  @Post("inventory-items/:id/enable")
  @ApiOperation({ summary: "Enable an inventory item" })
  enableItem(@Param("id") id: string) {
    return this.service.setInventoryItemActive(id, true);
  }
}
