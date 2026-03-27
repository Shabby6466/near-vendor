import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateItemDto, SearchNearbyDto } from "./dto/item.dto";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
import { VerifiedVendorGuard } from "../vendor/guards/verified-vendor.guard";

@ApiTags("items")
@ApiCookieAuth()
@ApiBearerAuth()
@Controller("item")
@UseGuards(JwtAuthGuard, VerifiedVendorGuard)
export class ItemController {
    constructor(private readonly service: ItemService) { }


    @Post('create')
    @ApiOperation({
        summary: 'Create a new item',
        description: 'Creates a new item for the authenticated vendor in a specific shop',
    })
    async createItem(@Body() itemDto: CreateItemDto, @Req() req: any) {
        return await this.service.createItem(req.user.id, itemDto);
    }

    @Put('update/:id')
    @ApiOperation({
        summary: 'Update an item',
        description: 'Updates an item for the authenticated vendor',
    })
    async updateItem(@Param('id') id: string, @Body() itemDto: CreateItemDto, @Req() req: any) {
        return await this.service.updateItem(id, itemDto, req.user.id);
    }

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete an item',
        description: 'Deletes an item for the authenticated vendor',
    })
    async deleteItem(@Param('id') id: string, @Req() req: any) {
        return await this.service.deleteItem(id, req.user.id);
    }

    @Get('get-all-by-shop/:shopId')
    @ApiOperation({
        summary: 'Get all items by shop id',
        description: 'Gets all items for the authenticated vendor in a specific shop',
    })
    async getAllByShopId(@Param('shopId') shopId: string, @Req() req: any) {
        return await this.service.getAllByShopId(req.user.id, shopId);
    }


    @Get('search-vendor-inventory/:shopId')
    @ApiOperation({
        summary: 'Search vendor inventory',
        description: 'Searches for items in the authenticated vendor\'s shop inventory',
    })
    @ApiQuery({
        name: 'searchTerm',
        description: 'Search term',
        required: true,
        type: String,
    })
    async searchVendorInventory(@Param('shopId') shopId: string, @Req() req: any) {
        return await this.service.searchVendorInventory(req.user.id, shopId, req.query.searchTerm);
    }

    @Get('search-nearby')
    @ApiOperation({
        summary: 'Search nearby items',
        description: 'Searches for items near the authenticated user',
    })
    async searchNearby(@Req() req: any, @Body() dto: SearchNearbyDto) {
        return await this.service.searchNearby(dto.query, dto.lat, dto.lon, dto.radius, dto.page, dto.limit);
    }

}