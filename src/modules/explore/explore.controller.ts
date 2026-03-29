import { Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExploreService } from "./explore.service";
import { NearbyShopsQueryDto, SearchItemsQueryDto, SearchShopsQueryDto, VisualSearchQueryDto } from "./dto/explore.dto";
import { OptionalAuthGuard } from "@modules/auth/auth-utils/optional-guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "@modules/common/decorator/current-user.decorator";
import { User } from "models/entities/users.entity";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";

@ApiTags('Explore')
@Controller('explore')
export class ExploreController {
    constructor(private readonly exploreService: ExploreService) { }

    @Get('shops/nearby')
    @ApiOperation({ summary: 'Find shops based on GPS coordinates' })
    @ApiResponse({ status: 200, description: 'Nearby shops retrieved successfully' })
    async findNearbyShops(@Query() query: NearbyShopsQueryDto) {
        return await this.exploreService.findNearbyShops(query.lat, query.lon, query.radius, query.page, query.limit, query.categoryId);
    }

    @Get('shops/map')
    @ApiOperation({ summary: 'Get lightweight shop data for map (Unguarded)' })
    @ApiResponse({ status: 200, description: 'Map data retrieved successfully' })
    async getShopsForMap(@Query() query: NearbyShopsQueryDto) {
        return await this.exploreService.getShopsForMap(query.lat, query.lon, query.radius, query.categoryId);
    }

    @Get('shops/search')
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: 'Fuzzy search for shops by name' })
    @ApiResponse({ status: 200, description: 'Shops found successfully' })
    async searchShops(@Query() query: SearchShopsQueryDto, @CurrentUser() user?: User) {
        return await this.exploreService.searchShops(query.query, query.lat, query.lon, query.radius, query.page, query.limit, user?.id);
    }

    @Get('shop/:id')
    @ApiOperation({ summary: 'Get public profile of a shop' })
    @ApiResponse({ status: 200, description: 'Shop details retrieved successfully' })
    async getShopDetails(@Param('id') id: string) {
        return await this.exploreService.getShopDetails(id);
    }

    @Get('items/search')
    @UseGuards(OptionalAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'High-performance fuzzy search for items' })
    @ApiResponse({ status: 200, description: 'Items found successfully' })
    async searchItems(@Query() query: SearchItemsQueryDto, @CurrentUser() user?: User) {
        return await this.exploreService.searchItems(query.query, query.lat, query.lon, query.radius, query.page, query.limit, user?.id);
    }

    @Get('recent-searches')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get recent searches for the logged-in user' })
    @ApiResponse({ status: 200, description: 'Recent searches retrieved successfully' })
    async getRecentSearches(@CurrentUser() user: User) {
        return await this.exploreService.getRecentSearches(user.id);
    }

    @Get('recent-items')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get recently viewed items for the logged-in user' })
    @ApiResponse({ status: 200, description: 'Recent items retrieved successfully' })
    async getRecentItems(@CurrentUser() user: User) {
        return await this.exploreService.getRecentItems(user.id);
    }

    @Post('search/visual')
    @ApiOperation({ summary: 'Visual search for items by uploading an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Visually similar items found successfully' })
    @UseInterceptors(FileInterceptor('image'))
    async searchVisual(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: VisualSearchQueryDto,
    ) {
        if (!file) {
            throw new Error('Please upload an image for visual search');
        }
        return await this.exploreService.searchVisual(file, query.lat, query.lon, query.radius, query.page, query.limit);
    }
}
