import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EnQueue } from "@modules/processor/common/processor.enum";
import { LoggerModule } from "@utils/logger/logger.module";
import { PushNotificationProcessor } from "./push-notification.processor";
import { ImageProcessor } from "@modules/processor/image.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "models/entities/items.entity";

@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: EnQueue.SCHEDULED_TX,
      },
      {
        name: EnQueue.PUSH_NOTIFICATION,
      },
      {
        name: EnQueue.IMAGE_PROCESSING,
      }
    ),
    TypeOrmModule.forFeature([Item]),
    LoggerModule,
  ],
  providers: [PushNotificationProcessor, ImageProcessor],
  exports: [],
})
export class ProcessorModule { }
