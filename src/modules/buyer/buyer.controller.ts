import { Body, Controller, Post, Get, Param, Query } from "@nestjs/common";
import { BuyerService } from "./buyer.service";
import { CreateBuyerDto } from "./dto/buyer.dto";
import {
    ApiBearerAuth,
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

@Controller("buyer")
@ApiTags("buyers")
@ApiCookieAuth()
@ApiBearerAuth()
export class BuyerController {
    constructor(private readonly service: BuyerService) { }

    @Post("create")
    @ApiOperation({ summary: "Create buyer user" })
    @ApiOkResponse({ description: "Create a new buyer" })
    async createBuyer(@Body() dto: CreateBuyerDto) {
        return this.service.createBuyer(dto);
    }

    @Get("get-by-phone-number")
    @ApiOperation({ summary: "Get a buyer by phone number" })
    @ApiOkResponse({ description: "Get a buyer by phone number" })
    async getBuyerByPhoneNumber(@Query("phoneNumber") phoneNumber: string) {
        return this.service.getBuyerByPhoneNumber(phoneNumber);
    }

    @Get("get/:id")
    @ApiOperation({ summary: "Get a  buyer" })
    @ApiOkResponse({ description: "Get a buyer" })
    async getAllBuyers(@Param("id") id: string) {
        return this.service.getBuyer(id);
    }





}