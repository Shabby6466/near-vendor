import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shops } from "../../models/entities/shops.entity";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { VendorModule } from "../vendor/vendor.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Shops]), VendorModule, AuthModule],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService],
})
export class ShopModule {}