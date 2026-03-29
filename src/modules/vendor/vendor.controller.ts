import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards, Query } from "@nestjs/common";
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

    @Get('me/profile')
    @ApiOperation({ summary: 'Get vendor me profile' })
    @ApiResponse({ status: 200, description: 'Vendor me profile fetched successfully' })
    @ApiResponse({ status: 404, description: 'Vendor not found' })
    async getVendorMeProfile(@Req() req: any) {
        return await this.vendorService.getMeVendorProfile(req.user.id);
    }

    @Get('portfolio/search')
    @ApiOperation({ summary: 'Search within vendor portfolio (shops and items)' })
    @ApiResponse({ status: 200, description: 'Search results fetched successfully' })
    async searchPortfolio(
        @Req() req: any, 
        @Query('query') query: string,
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        return await this.vendorService.searchPortfolio(
            req.user.id, 
            query, 
            page ? parseInt(page) : 1, 
            limit ? parseInt(limit) : 10
        );
    }

    @Get('portfolio/performance')
    @ApiOperation({ summary: 'Get portfolio performance analytics (best/worst items)' })
    @ApiResponse({ status: 200, description: 'Performance data fetched successfully' })
    async getPortfolioPerformance(@Req() req: any, @Query('days') daysString: string) {
        const days = daysString ? parseInt(daysString) : 30;
        return await this.vendorService.getPortfolioPerformance(req.user.id, days);
    }
}