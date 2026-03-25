import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto/vendor.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('vendor')
@ApiTags('vendor')
export class VendorController {
    constructor(
        private readonly vendorService: VendorService,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new vendor' })
    @ApiResponse({ status: 201, description: 'Vendor registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request' })
    async registerVendor(@Body() vendorDto: CreateVendorDto) {
        return await this.vendorService.registerVendor(vendorDto);
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

}