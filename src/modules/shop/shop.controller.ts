import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { CreateShopDto } from "./dto/shop.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";
import { Roles } from "@modules/auth/roles.decorator";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
import { RolesGuard } from "@modules/auth/roles.guard";

@ApiTags("Shops")
@Controller("shop")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ShopController {
    constructor(private readonly service: ShopService) { }

    @Post("create")
    @ApiOperation({ summary: "Create shop" })
    @ApiOkResponse({ description: "Create a new shop" })
    @Roles(UserRoles.SELLER)
    async createShop(@Body() dto: CreateShopDto) {
        return this.service.createShop(dto);
    }

    @Get("get-by-id")
    @ApiOperation({ summary: "Get shop by id" })
    @ApiOkResponse({ description: "Get shop by id" })
    @Roles(UserRoles.SELLER)
    async getShopById(@Param("id") id: string) {
        return this.service.getShopById(id);
    }

    @Get("get-by-seller-id")
    @ApiOperation({ summary: "Get shop by seller id" })
    @ApiOkResponse({ description: "Get shop by seller id" })
    async getShopBySellerId(@Param("id") id: string) {
        return this.service.getShopBySellerId(id);
    }
}