import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "@utils/s3/s3.service";
import { ApplyVendorDto } from "./dto/apply-vendor.dto";
import { UploadShopImageDto } from "./dto/upload-shop-image.dto";
import { VendorApplicationsService } from "./vendor-applications.service";

@ApiTags("vendor")
@Controller("vendor")
export class VendorApplicationsController {
  constructor(private readonly service: VendorApplicationsService) {}

  @Post("apply")
  @ApiOperation({ summary: "Apply to become a vendor" })
  apply(@Body() dto: ApplyVendorDto) {
    return this.service.apply(dto);
  }

  @Post("upload-shop-image")
  @ApiOperation({ summary: "Upload shop image for vendor application (returns imageUrl)" })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: S3Service.imageFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadShopImage(@Body() _dto: UploadShopImageDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadShopImage(file);
  }
}

