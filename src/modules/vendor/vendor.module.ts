import { Module } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { AuthModule } from "../auth/auth.module";
import { User } from "models/entities/users.entity";
import { UserService } from "@modules/users/users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendors, User]),
        AuthModule,
    ],
    controllers: [VendorController],
    providers: [VendorService, UserService],
    exports: [VendorService, TypeOrmModule],
})
export class VendorModule { }