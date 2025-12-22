import { Body, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { CreateShopDto } from "./dto/shop.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { Post } from "@nestjs/common";

@Controller("shop")
@ApiTags("shops")
@ApiCookieAuth()
@ApiBearerAuth()
export class ShopController {
    constructor(private readonly service: ShopService) { }

    @Post("create")
    @ApiOperation({ summary: "Create shop" })
    @ApiOkResponse({ description: "Create a new shop" })
    async createShop(@Body() dto: CreateShopDto) {
        return this.service.createShop(dto);
    }
}