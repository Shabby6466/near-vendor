import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from '../../models/entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { VendorModule } from '@modules/vendor/vendor.module';
import { ItemModule } from '@modules/items/item.module';
import { ShopModule } from '@modules/shop/shop.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Wishlist]),
        AuthModule,
        VendorModule, // for VerifiedVendorGuard
        ItemModule,
        ShopModule,
    ],
    controllers: [WishlistController],
    providers: [WishlistService],
    exports: [WishlistService],
})
export class WishlistModule {}
