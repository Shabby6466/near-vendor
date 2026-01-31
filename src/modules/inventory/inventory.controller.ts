import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";

@ApiTags("inventory")
@Controller("inventory")
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post("items")
  @ApiOperation({ summary: "Create inventory item" })
  create(@Body() dto: CreateInventoryItemDto) {
    return this.service.create(dto);
  }

  @Get("items")
  @ApiOperation({ summary: "List inventory items by shop" })
  list(@Query("shopId") shopId: string) {
    return this.service.listByShop(shopId);
  }
}
