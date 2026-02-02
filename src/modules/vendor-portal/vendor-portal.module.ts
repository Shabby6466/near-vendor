import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shops } from "models/entities/shops.entity";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { VendorPortalController } from "./vendor-portal.controller";
import { VendorPortalService } from "./vendor-portal.service";

@Module({
  imports: [TypeOrmModule.forFeature([Shops, InventoryItem])],
  controllers: [VendorPortalController],
  providers: [VendorPortalService],
})
export class VendorPortalModule {}
