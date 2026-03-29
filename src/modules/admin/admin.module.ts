import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminSyncController } from "./admin-sync.controller";
import { AdminController } from "./admin.controller";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { User } from "models/entities/users.entity";
import { Shops } from "models/entities/shops.entity";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Item } from "models/entities/items.entity";
import { Vendors } from "models/entities/vendors.entity";
import { VendorModule } from "@modules/vendor/vendor.module";
import { AuthModule } from "@modules/auth/auth.module";
import { UsersModule } from "@modules/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorApplication,
      User,
      Shops,
      InventoryItem,
      Item,
      Vendors,
    ]),
    VendorModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AdminService],
  controllers: [AdminSyncController, AdminController],
  exports: [AdminService],
})
export class AdminModule {}
