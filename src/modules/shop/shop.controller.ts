import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { JwtAuthGuard } from "../auth/auth-utils/jwt-guard";
import { VerifiedVendorGuard } from "../vendor/guards/verified-vendor.guard";
import { CreateShopDto, DeleteShopDto, UpdateShopDto } from "./dto/shop.dto";

@Controller('shops')
@ApiTags('shops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerifiedVendorGuard)
export class ShopController {
    constructor(private readonly shopService: ShopService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create a new shop' })
    @ApiResponse({ status: 201, description: 'Shop created successfully' })
    async createShop(@Req() req: any, @Body() shopDto: CreateShopDto) {
        return await this.shopService.createShop(req.user.id, shopDto);
    }

    @Patch('update')
    @ApiOperation({ summary: 'Update shop profile' })
    @ApiResponse({ status: 200, description: 'Shop profile updated successfully' })
    async updateShop(@Req() req: any, @Body() shopDto: UpdateShopDto) {
        return await this.shopService.updateShop(req.user.id, req.user.shopId, shopDto);
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete shop' })
    @ApiResponse({ status: 200, description: 'Shop deleted successfully' })
    async deleteShop(@Req() req: any, @Body() shopId: DeleteShopDto) {
        return await this.shopService.deleteShop(req.user.id, shopId.shopId);
    }

    @Get('me/shops')
    @ApiOperation({ summary: 'Find shops by vendor id' })
    @ApiResponse({ status: 200, description: 'Shop found successfully' })
    async findShopByVendorId(@Req() req: any,) {
        return await this.shopService.findByVendor(req.user.id,);
    }


}