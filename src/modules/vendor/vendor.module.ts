import { Module } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendors]),
        AuthModule,
    ],
    controllers: [VendorController],
    providers: [VendorService],
    exports: [VendorService, TypeOrmModule],
})
export class VendorModule { }