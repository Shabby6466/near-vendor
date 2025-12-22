import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shops } from "models/entities/shops.entity";
import { ShopService } from "./shop.service";
import { ShopController } from "./shop.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Shops])],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService],
})
export class ShopModule { }