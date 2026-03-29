import { Module, forwardRef } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { AuthModule } from "../auth/auth.module";
import { User } from "models/entities/users.entity";
import { UserService } from "@modules/users/users.service";
import { AnalyticsModule } from "../analytics/analytics.module";

import { Shops } from "../../models/entities/shops.entity";
import { Item } from "../../models/entities/items.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendors, User, Shops, Item]),
        AuthModule,
        forwardRef(() => AnalyticsModule),
    ],
    controllers: [VendorController],
    providers: [VendorService, UserService],
    exports: [VendorService, TypeOrmModule],
})
export class VendorModule { }