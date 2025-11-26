import { Module } from "@nestjs/common";
import { SeedService } from "./seeder.service";
import { LoggerService } from "@utils/logger/logger.service";
@Module({
  imports: [],
  exports: [SeedService],
  providers: [SeedService, LoggerService],
})
export class SeedModule {}
