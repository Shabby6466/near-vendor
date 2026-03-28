import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminSyncController } from "./admin-sync.controller";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { User } from "models/entities/users.entity";
import { Shops } from "models/entities/shops.entity";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Item } from "models/entities/items.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorApplication,
      User,
      Shops,
      InventoryItem,
      Item,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminSyncController],
  exports: [AdminService],
})
export class AdminModule {}
