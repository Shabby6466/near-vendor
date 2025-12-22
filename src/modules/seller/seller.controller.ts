import { Body, Controller, Post, Get, Param, Query, Patch } from "@nestjs/common";
import { SellerService } from "./seller.service";
import {
    ApiBearerAuth,
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { createSellerDto } from "./dto/seller.dto";

@Controller("seller")
@ApiTags("sellers")
@ApiCookieAuth()
@ApiBearerAuth()
export class SellerController {
    constructor(private readonly service: SellerService) { }

    @Post("create")
    @ApiOperation({ summary: "Create seller user" })
    @ApiOkResponse({ description: "Create a new seller" })
    async createSeller(@Body() dto: createSellerDto) {
        return this.service.createSeller(dto);
    }

    @Get('get-by-phone-number')
    @ApiOperation({ summary: "Get a seller by phone number" })
    @ApiOkResponse({ description: "Get a seller by phone number" })
    async getSellerByPhoneNumber(@Query('phoneNumber') phoneNumber: string) {
        return this.service.getSellerByPhoneNumber(phoneNumber);
    }

    @Patch("update/:id")
    @ApiOperation({ summary: "Update a seller" })
    @ApiOkResponse({ description: "Update a seller" })
    async updateSeller(@Param('id') id: string, @Body() dto: createSellerDto) {
        return this.service.updateSeller(id, dto);
    }

}