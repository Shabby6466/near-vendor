import { Module } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ShopModule } from "../shop/shop.module";
import { BullModule } from "@nestjs/bull";
import { EnQueue } from "@modules/processor/common/processor.enum";
import { ItemController } from "./item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "models/entities/items.entity";
import { VendorModule } from "../vendor/vendor.module";
import { AuthModule } from "../auth/auth.module";
import { AnalyticsModule } from "@modules/analytics/analytics.module";
import { HistoryModule } from "../history/history.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]), 
        BullModule.registerQueue({
            name: EnQueue.IMAGE_PROCESSING,
        }),
        ShopModule, 
        VendorModule, 
        AuthModule, 
        AnalyticsModule, 
        HistoryModule, 
        CategoriesModule
    ],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
})
export class ItemModule { }