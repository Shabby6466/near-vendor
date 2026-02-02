import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { User } from "models/entities/users.entity";
import { Shops } from "models/entities/shops.entity";
import { InventoryItem } from "models/entities/inventory-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VendorApplication, User, Shops, InventoryItem])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
