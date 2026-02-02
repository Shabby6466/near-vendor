import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "@utils/s3/s3.service";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
import { RolesGuard } from "@modules/auth/roles.guard";
import { Roles } from "@modules/auth/roles.decorator";
import { UserRoles } from "@utils/enum";
import { VendorPortalService } from "./vendor-portal.service";

@ApiTags("vendor")
@Controller("vendor")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRoles.VENDOR)
export class VendorPortalController {
  constructor(private readonly service: VendorPortalService) {}

  @Get("me")
  @ApiOperation({ summary: "Vendor: get my profile + shop (MVP one shop per vendor)" })
  me(@Req() req: any) {
    return this.service.me(req.user);
  }

  @Get("inventory/items")
  @ApiOperation({ summary: "Vendor: list my inventory items" })
  list(@Req() req: any) {
    return this.service.listMyItems(req.user);
  }

  @Post("inventory/items")
  @ApiOperation({ summary: "Vendor: create inventory item in my shop" })
  create(@Req() req: any, @Body() body: any) {
    return this.service.createMyItem(req.user, body);
  }

  @Patch("inventory/items/:id")
  @ApiOperation({ summary: "Vendor: update my inventory item" })
  update(@Req() req: any, @Param("id") id: string, @Body() body: any) {
    return this.service.updateMyItem(req.user, id, body);
  }

  @Post("inventory/items/upload-csv")
  @ApiOperation({ summary: "Vendor: upload CSV of items (headers: name,description,price,stock,tags)" })
  @UseInterceptors(FileInterceptor("file"))
  uploadCsv(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadCsv(req.user, file);
  }

  @Post("inventory/items/upload-image")
  @ApiOperation({ summary: "Vendor: upload an image (returns imageUrl)" })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: S3Service.imageFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    })
  )
  uploadImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(req.user, file);
  }
}

