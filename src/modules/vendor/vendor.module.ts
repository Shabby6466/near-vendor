import { Module } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendors]),
    ],
    controllers: [VendorController],
    providers: [VendorService],
    exports: [VendorService, TypeOrmModule],
})
export class VendorModule { }