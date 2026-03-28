import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { OptionalAuthGuard } from "@modules/auth/auth-utils/optional-guard";
import { CurrentUser } from "@modules/common/decorator/current-user.decorator";
import { User } from "models/entities/users.entity";
import { ItemService } from "./items.service";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateItemDto, SearchNearbyDto, UpdateItemDto } from "./dto/item.dto";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
import { VerifiedVendorGuard } from "../vendor/guards/verified-vendor.guard";
import { Request, Response } from "express";
import { Pagination } from "@utils/paginate";

@ApiTags("items")
@ApiCookieAuth()
@ApiBearerAuth()
@Controller("item")
export class ItemController {
    constructor(private readonly service: ItemService) { }


    @Post('create')
    @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
    @ApiOperation({
        summary: 'Create a new item',
        description: 'Creates a new item for the authenticated vendor in a specific shop',
    })
    async createItem(@Body() itemDto: CreateItemDto, @Req() req: any) {
        return await this.service.createItem(req.user.id, itemDto);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
    @ApiOperation({
        summary: 'Update an item',
        description: 'Updates an item for the authenticated vendor',
    })
    async updateItem(@Param('id') id: string, @Body() itemDto: UpdateItemDto, @Req() req: any) {
        return await this.service.updateItem(id, itemDto, req.user.id);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
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
        description: 'Gets all items in a specific shop',
    })
    @ApiParam({ name: "shopId", description: "The UUID of the shop", example: "8181903d-b6cb-43ee-889f-b3b2999601ef" })
    async getAllByShopId(@Param('shopId') shopId: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const options = await Pagination.paginate(req, res);
        return await this.service.getAllItemsByShopId(shopId, options);
    }


    @Get('search-vendor-inventory/:shopId')
    @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
    @ApiOperation({
        summary: 'Search vendor inventory',
        description: 'Searches for items in the authenticated vendor\'s shop inventory',
    })
    @ApiParam({ name: "shopId", description: "The UUID of the shop" })
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
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({
        summary: 'Search nearby items',
        description: 'Searches for items near a given location (Public API)',
    })
    async searchNearby(@Query() dto: SearchNearbyDto, @CurrentUser() user?: User) {
        return await this.service.searchNearby(dto.query, dto.lat, dto.lon, dto.radius, dto.page, dto.limit, user?.id);
    }

    @Get(':id')
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({
        summary: 'Get item by id',
        description: 'Gets an item by its id',
    })
    @ApiParam({ name: "id", description: "The UUID of the item", example: "8181903d-b6cb-43ee-889f-b3b2999601ef" })
    async getItemById(@Param('id') id: string, @CurrentUser() user?: User) {
        return await this.service.getItemById(id, user?.id);
    }

}