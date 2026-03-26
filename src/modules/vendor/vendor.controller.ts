import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto/vendor.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "@modules/auth/auth-utils/roles.guard";
import { Roles } from "@modules/auth/auth-utils/roles.decorator";
import { UserRoles } from "@utils/enum";

@Controller('vendor')
@ApiTags('vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
    constructor(
        private readonly vendorService: VendorService,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new vendor' })
    @ApiResponse({ status: 201, description: 'Vendor registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request' })
    async registerVendor(@Req() req: any, @Body() vendorDto: CreateVendorDto) {
        return await this.vendorService.registerVendor(vendorDto, req.user.id);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get vendor me profile' })
    @ApiResponse({ status: 200, description: 'Vendor me profile fetched successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    async getVendorMeProfile(@Req() req: any) {
        return await this.vendorService.getVendorMeProfile(req.user.id);
    }

    @Put('update')
    @ApiOperation({ summary: 'Update vendor profile' })
    @ApiResponse({ status: 200, description: 'Vendor profile updated successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    async updateVendorProfile(@Req() req: any, @Body() vendorDto: UpdateVendorDto) {
        return await this.vendorService.updateVendorProfile(req.user.id, vendorDto);
    }

    @Get('me/status')
    @ApiOperation({ summary: 'Get vendor me status' })
    @ApiResponse({ status: 200, description: 'Vendor me status fetched successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    async getMeVendorStatus(@Req() req: any) {
        return await this.vendorService.getMeVendorStatus(req.user.id);
    }

    @Patch('approve/:vendorId')
    @Roles(UserRoles.SUPERADMIN)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Approve a vendor (SUPERADMIN only)' })
    @ApiParam({ name: 'vendorId', description: 'The vendor profile UUID' })
    @ApiResponse({ status: 200, description: 'Vendor approved successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    async approveVendor(@Param('vendorId') vendorId: string) {
        return await this.vendorService.approveVendor(vendorId);
    }

    @Get('pending')
    @Roles(UserRoles.SUPERADMIN)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Get all pending vendor profiles (SUPERADMIN only)' })
    @ApiResponse({ status: 200, description: 'Pending vendor profiles fetched successfully' })
    async getPendingVendors() {
        return await this.vendorService.getPendingVendors();
    }

}