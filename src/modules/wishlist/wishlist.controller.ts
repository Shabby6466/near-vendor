import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, Query, ParseFloatPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '@modules/auth/auth-utils/jwt-guard';
import { VerifiedVendorGuard } from '@modules/vendor/guards/verified-vendor.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('wishlist')
@ApiTags('Wishlist')
@ApiBearerAuth()
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    // ----------------------------------------------------------------------
    // User Endpoints
    // ----------------------------------------------------------------------

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new wishlist request (unmet demand)' })
    @ApiResponse({ status: 201, description: 'Wishlist item created successfully' })
    async createWish(@Req() req: any, @Body() dto: CreateWishlistDto) {
        return await this.wishlistService.createWish(req.user.id, dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get the current user\'s wishlist active requests' })
    @ApiResponse({ status: 200, description: 'User wishlist fetched successfully' })
    async getUserWishes(
        @Req() req: any,
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return await this.wishlistService.getUserWishes(req.user.id, pageNum, limitNum);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a wishlist request' })
    @ApiResponse({ status: 200, description: 'Wishlist item deleted successfully' })
    async deleteWish(@Req() req: any, @Param('id') wishId: string) {
        return await this.wishlistService.deleteWish(req.user.id, wishId);
    }

    @Patch(':id/complete')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Mark a wishlist request as fulfilled' })
    @ApiResponse({ status: 200, description: 'Wishlist item marked as fulfilled successfully' })
    async completeWish(@Req() req: any, @Param('id') wishId: string) {
        return await this.wishlistService.completeWish(req.user.id, wishId);
    }

    // ----------------------------------------------------------------------
    // Vendor Endpoints
    // ----------------------------------------------------------------------

    @Get('explore')
    @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
    @ApiOperation({ summary: 'Explore local unmet demand (For Vendors)' })
    @ApiResponse({ status: 200, description: 'Local demand fetched successfully' })
    async exploreDemand(
        @Req() req: any,
        @Query('lat', ParseFloatPipe) lat: number,
        @Query('lon', ParseFloatPipe) lon: number,
        @Query('radius') radiusString: string,
    ) {
        const radius = radiusString ? parseInt(radiusString) : 5000;
        return await this.wishlistService.exploreLocalDemand(req.user.id, lat, lon, radius);
    }
}
