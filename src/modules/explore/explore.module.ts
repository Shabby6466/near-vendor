import { Module } from "@nestjs/common";
import { ShopModule } from "@modules/shop/shop.module";
import { ExploreService } from "./explore.service";
import { ExploreController } from "./explore.controller";
import { AnalyticsModule } from "@modules/analytics/analytics.module";
import { ItemModule } from "../items/item.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SearchHistory, RecentItem]), ShopModule, AnalyticsModule, ItemModule],
    providers: [ExploreService],
    controllers: [ExploreController],
})
export class ExploreModule { }
