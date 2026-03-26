import { Module } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ShopModule } from "../shop/shop.module";
import { ItemController } from "./item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "models/entities/items.entity";
import { VendorModule } from "../vendor/vendor.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Item]), ShopModule, VendorModule, AuthModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
})
export class ItemModule { }