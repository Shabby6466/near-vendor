import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { GeminiVisionService } from "./gemini-vision.service";
import { ImageCacheService } from "./image-cache.service";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem])],
  controllers: [SearchController],
  providers: [SearchService, GeminiVisionService, ImageCacheService],
})
export class SearchModule {}
