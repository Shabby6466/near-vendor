import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem]), CategoriesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
