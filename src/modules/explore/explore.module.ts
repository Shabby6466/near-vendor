import { Module, forwardRef } from "@nestjs/common";
import { ShopModule } from "@modules/shop/shop.module";
import { ExploreService } from "./explore.service";
import { ExploreController } from "./explore.controller";
import { AnalyticsModule } from "@modules/analytics/analytics.module";
import { ItemModule } from "../items/item.module";
import { HistoryModule } from "../history/history.module";

@Module({
    imports: [
        ShopModule, 
        AnalyticsModule, 
        HistoryModule,
        forwardRef(() => ItemModule)
    ],
    providers: [ExploreService],
    controllers: [ExploreController],
    exports: [ExploreService],
})
export class ExploreModule { }
