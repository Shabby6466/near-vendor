import { Module } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ShopModule } from "../shop/shop.module";
import { ItemController } from "./item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "models/entities/items.entity";
import { VendorModule } from "../vendor/vendor.module";
import { AuthModule } from "../auth/auth.module";
import { AnalyticsModule } from "@modules/analytics/analytics.module";

import { Category } from "models/entities/categories.entity";
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Item, Category, SearchHistory, RecentItem]), ShopModule, VendorModule, AuthModule, AnalyticsModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
})
export class ItemModule { }