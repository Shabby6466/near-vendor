import { Body, Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateItemDto, SearchNearbyDto } from "./dto/item.dto";

@ApiTags("items")
@ApiCookieAuth()
@ApiBearerAuth()
@Controller("item")
export class ItemController {
    constructor(private readonly service: ItemService) { }


    @Post('create')
    @ApiOperation({
        summary: 'Create a new item',
        description: 'Creates a new item for the authenticated vendor',
    })
    async createItem(@Body() itemDto: CreateItemDto, @Req() req: any) {
        return await this.service.createItem(req.user.id, itemDto, req.user.shopId);
    }

    @Put('update/:id')
    @ApiOperation({
        summary: 'Update an item',
        description: 'Updates an item for the authenticated vendor',
    })
    async updateItem(@Body() itemDto: CreateItemDto, @Req() req: any) {
        return await this.service.updateItem(req.user.id, itemDto, req.user.shopId);
    }

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete an item',
        description: 'Deletes an item for the authenticated vendor',
    })
    async deleteItem(@Req() req: any) {
        return await this.service.deleteItem(req.user.id, req.user.shopId);
    }

    @Get('get-all-by-shop-id')
    @ApiOperation({
        summary: 'Get all items by shop id',
        description: 'Gets all items for the authenticated vendor',
    })
    async getAllByShopId(@Req() req: any) {
        return await this.service.getAllByShopId(req.user.id, req.user.shopId);
    }


    @Get('search-vendor-inventory')
    @ApiOperation({
        summary: 'Search vendor inventory',
        description: 'Searches for items in the authenticated vendor\'s inventory',
    })
    @ApiQuery({
        name: 'searchTerm',
        description: 'Search term',
        required: true,
        type: String,
    })
    async searchVendorInventory(@Req() req: any) {
        return await this.service.searchVendorInventory(req.user.id, req.user.shopId, req.query.searchTerm);
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