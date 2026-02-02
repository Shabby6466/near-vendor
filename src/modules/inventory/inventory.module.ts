import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Shops } from "models/entities/shops.entity";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";

import { BullModule } from "@nestjs/bull";
import { EMBEDDING_QUEUE } from "@modules/embedding.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Shops]),
    BullModule.registerQueue({
      name: EMBEDDING_QUEUE,
    }),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule { }
