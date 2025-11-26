import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { S3Service } from "@utils/s3/s3.service";
import { MediaService } from "./media.service";

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [S3Service, MediaService],
})
export class MediaModule {}
