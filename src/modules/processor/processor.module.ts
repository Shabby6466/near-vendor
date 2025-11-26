import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EnQueue } from "@modules/processor/common/processor.enum";
import { LoggerModule } from "@utils/logger/logger.module";
import { PushNotificationProcessor } from "./push-notification.processor";

@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: EnQueue.SCHEDULED_TX,
      },
      {
        name: EnQueue.PUSH_NOTIFICATION,
      }
    ),
    LoggerModule,
  ],
  providers: [PushNotificationProcessor],
  exports: [],
})
export class ProcessorModule {}
