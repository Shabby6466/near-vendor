import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApplyVendorDto } from "./dto/apply-vendor.dto";
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
}
