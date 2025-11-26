import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { S3Service } from "@utils/s3/s3.service";
import { MediaService } from "./media.service";

@Controller("media")
@ApiTags("Media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
}
