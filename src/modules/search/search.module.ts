import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
