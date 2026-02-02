import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { VendorApplicationsController } from "./vendor-applications.controller";
import { VendorApplicationsService } from "./vendor-applications.service";

@Module({
  imports: [TypeOrmModule.forFeature([VendorApplication])],
  controllers: [VendorApplicationsController],
  providers: [VendorApplicationsService],
  exports: [VendorApplicationsService],
})
export class VendorApplicationsModule {}
