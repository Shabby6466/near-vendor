import { Module } from "@nestjs/common";
import { BuyerController } from "./buyer.controller";
import { BuyerService } from "./buyer.service";
import { Buyers } from "models/entities/buyers.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Buyers])],
    controllers: [BuyerController],
    providers: [BuyerService],
    exports: [BuyerService],
})
export class BuyerModule { }