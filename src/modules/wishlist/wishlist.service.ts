import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist, WishlistStatus } from '../../models/entities/wishlist.entity';
import { ItemService } from '../items/items.service';
import { ShopService } from '../shop/shop.service';
import { CreateWishlistDto } from './dto/wishlist.dto';
import { ResponseCode } from '@utils/enum';

@Injectable()
export class WishlistService {
    private readonly logger = new Logger(WishlistService.name);

    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,
        private readonly itemService: ItemService,
        private readonly shopService: ShopService,
    ) { }

    async createWish(userId: string, dto: CreateWishlistDto) {
        try {
            const wish = this.wishlistRepository.create({
                itemName: dto.itemName,
                description: dto.description,
                categoryId: dto.categoryId,
                user: { id: userId } as any,
                location: {
                    type: 'Point',
                    coordinates: [dto.lon, dto.lat]
                }
            });

            await this.wishlistRepository.save(wish);
            return {
                success: true,
                statusCode: ResponseCode.SUCCESS,
                message: 'Wishlist item created successfully',
                data: wish
            };
        } catch (error) {
            this.logger.error(`Failed to create wish: ${error.message}`);
            return {
                success: false,
                statusCode: ResponseCode.BAD_REQUEST,
                message: 'Failed to create wishlist item'
            };
        }
    }

    async getUserWishes(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        
        const [wishes, total] = await this.wishlistRepository.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip,
            take: limit
        });

        const wishesWithMatches = await Promise.all(
            wishes.map(async (wish) => {
                let matchedItems = [];
                if (wish.status === WishlistStatus.PENDING && wish.location) {
                    try {
                        const [lon, lat] = wish.location.coordinates;
                        const searchResult = await this.itemService.searchHybrid(
                            wish.itemName,
                            lat,
                            lon,
                            10000,
                            1,
                            5
                        );
                        matchedItems = searchResult.data || [];
                    } catch (err) {
                        this.logger.warn(`Failed to find matched items for wish ${wish.id}: ${err.message}`);
                    }
                }

                return {
                    ...wish,
                    matchedItems
                };
            })
        );

        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: {
                items: wishesWithMatches,
                meta: {
                    totalItems: total,
                    itemCount: wishesWithMatches.length,
                    itemsPerPage: limit,
                    totalPages,
                    currentPage: page,
                }
            }
        };
    }

    async deleteWish(userId: string, wishId: string) {
        const wish = await this.wishlistRepository.findOne({
            where: { id: wishId, user: { id: userId } }
        });

        if (!wish) {
            throw new NotFoundException('Wishlist item not found or unauthorized');
        }

        await this.wishlistRepository.remove(wish);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Wishlist item deleted successfully'
        };
    }

    async completeWish(userId: string, wishId: string) {
        const wish = await this.wishlistRepository.findOne({
            where: { id: wishId, user: { id: userId } }
        });

        if (!wish) {
            throw new NotFoundException('Wishlist item not found or unauthorized');
        }

        wish.status = WishlistStatus.FULFILLED;
        await this.wishlistRepository.save(wish);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Wishlist item marked as fulfilled',
            data: wish
        };
    }

    // Vendor exploration using PostGIS ST_DWithin
    async exploreLocalDemand(vendorUserId: string, lat: number, lon: number, radiusMeters: number = 5000) {
        const locationGeoJSON = {
            type: 'Point',
            coordinates: [lon, lat]
        };

        const vendorShops = await this.shopService.findByVendorId(vendorUserId);
        const categoryIds = vendorShops
            .map(shop => shop.categoryId || (shop as any).category?.id)
            .filter(Boolean);

        const qb = this.wishlistRepository.createQueryBuilder('wish')
            .where('wish.status = :status', { status: WishlistStatus.PENDING })
            .andWhere('ST_DWithin(wish.location, ST_SetSRID(ST_GeomFromGeoJSON(:location), 4326)::geography, :radius)', {
                location: JSON.stringify(locationGeoJSON),
                radius: radiusMeters
            });

        if (categoryIds.length > 0) {
            // Include wishes that match the vendor's categories AND wishes with no category specified
            qb.andWhere('(wish.categoryId IN (:...categoryIds) OR wish.categoryId IS NULL)', { categoryIds });
        }

        const demands = await qb
            .orderBy('wish.createdAt', 'DESC')
            .limit(50) // Limit to 50 recent local demands
            .getMany();

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: demands,
            meta: {
                totalItems: demands.length,
                itemCount: demands.length,
            }
        };
    }
}
