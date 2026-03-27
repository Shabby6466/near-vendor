import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { CloudinaryService } from "@utils/cloudinary/cloudinary.service";
import { MediaService } from "./media.service";
import { AuthModule } from "@modules/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [CloudinaryService, MediaService],
})
export class MediaModule {}
