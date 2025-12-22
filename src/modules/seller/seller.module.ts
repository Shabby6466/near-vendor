import { Module } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "models/entities/sellers.entity";
import { SellerController } from "./seller.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Seller])],
    controllers: [SellerController],
    providers: [SellerService],
    exports: [SellerService],
})
export class SellerModule { }