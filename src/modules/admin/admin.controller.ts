import { Controller, Get, Post, Body, Query, UseGuards, Param, Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { LoginDto } from "@modules/users/dto/users.dto";
import { VendorService } from "@modules/vendor/vendor.service";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
import { RolesGuard } from "@modules/auth/auth-utils/roles.guard";
import { Roles } from "@modules/auth/auth-utils/roles.decorator";
import { UserRoles } from "@utils/enum";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from "@nestjs/swagger";

@Controller("admin")
@ApiTags("admin")
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post("login")
    @ApiOperation({ summary: "Admin login (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "Admin logged in successfully" })
    async adminLogin(@Body() dto: LoginDto) {
        return await this.adminService.adminLogin(dto);
    }

    @Get("users")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.SUPERADMIN)
    @ApiOperation({ summary: "Get all registered users (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "List of all users fetched successfully" })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    async getAllUsers(
        @Query("page") pageString: string,
        @Query("limit") limitString: string
    ) {
        const page = pageString ? parseInt(pageString) : 1;
        const limit = limitString ? parseInt(limitString) : 20;
        return await this.adminService.getAllUsers(page, limit);
    }

    @Get("vendors")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.SUPERADMIN)
    @ApiOperation({ summary: "Get all vendor profiles (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "List of all vendors fetched successfully" })
    @ApiQuery({ name: "status", required: false, type: String, description: "e.g. APPROVED, PENDING, REJECTED" })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    async getAllVendors(
        @Query("status") status: string,
        @Query("page") pageString: string,
        @Query("limit") limitString: string
    ) {
        const page = pageString ? parseInt(pageString) : 1;
        const limit = limitString ? parseInt(limitString) : 20;
        return await this.adminService.getAllVendors(status, page, limit);
    }

    @Patch("approve/:vendorId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.SUPERADMIN)
    @ApiOperation({ summary: "Approve a vendor profile (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "Vendor approved successfully" })
    async approveVendor(@Param("vendorId") vendorId: string) {
        return await this.adminService.approveVendor(vendorId);
    }

    @Get("pending")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.SUPERADMIN)
    @ApiOperation({ summary: "Get all pending vendor profiles (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "Pending vendor profiles fetched successfully" })
    async getPendingVendors() {
        return await this.adminService.getPendingVendors();
    }

    @Get("vendor/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.SUPERADMIN)
    @ApiOperation({ summary: "Get a specific vendor profile by ID (SUPERADMIN only)" })
    @ApiResponse({ status: 200, description: "Vendor profile fetched successfully" })
    async getVendorById(@Param("id") id: string) {
        return await this.adminService.getVendorById(id);
    }
}
