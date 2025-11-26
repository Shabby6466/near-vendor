import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { LoggerService } from "@utils/logger/logger.service";
import { EnJob, EnQueue } from "@modules/processor/common/processor.enum";

@Processor(EnQueue.PUSH_NOTIFICATION)
export class PushNotificationProcessor {
  constructor(private readonly loggerService: LoggerService) {}
}
