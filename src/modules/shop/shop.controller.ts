import { Body, Controller, Get, Param, Post, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { CreateShopDto } from "./dto/shop.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";
import { Roles } from "@modules/auth/roles.decorator";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
import { RolesGuard } from "@modules/auth/roles.guard";
import { Request } from "express";

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
    async createShop(@Body() dto: CreateShopDto, @Req() req: Request) {
        return this.service.createShop(dto, req.user);
    }

    @Get("get-by-id")
    @ApiOperation({ summary: "Get shop by id" })
    @ApiOkResponse({ description: "Get shop by id" })
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