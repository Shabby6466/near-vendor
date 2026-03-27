import { Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";

@Controller("media")
@ApiTags("Media")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @ApiOperation({ summary: "Upload an image file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The image file to upload",
        },
        folder: {
          type: "string",
          description: "Optional folder path in Cloudinary",
        },
      },
    },
  })
  @ApiQuery({ name: "folder", required: false })
  @ApiQuery({ name: "url", required: false, description: "Optional: Upload from a public URL instead of a file" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("folder") folder?: string,
    @Query("url") url?: string,
  ) {
    const uploadSource = file || url;
    return this.mediaService.uploadImage(uploadSource, folder);
  }

  @Post("upload-simple")
  @ApiOperation({ summary: "Upload an image and get only the URL" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The image file to upload",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImageSimple(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadImageSimple(file);
  }

  @Get(":publicId")
  @ApiOperation({ summary: "Get image information by public ID" })
  async getImage(@Param("publicId") publicId: string) {
    return this.mediaService.getImage(publicId);
  }
}
