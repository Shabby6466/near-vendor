import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";
import { HistoryService } from "./history.service";

@Module({
    imports: [TypeOrmModule.forFeature([SearchHistory, RecentItem])],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule { }
