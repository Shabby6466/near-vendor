import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist, WishlistStatus } from 'models/entities/wishlist.entity';
import { CreateWishlistDto } from './dto/wishlist.dto';
import { ResponseCode } from '@utils/enum';

@Injectable()
export class WishlistService {
    private readonly logger = new Logger(WishlistService.name);

    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,
    ) {}

    async createWish(userId: string, dto: CreateWishlistDto) {
        // Prevent duplicate identically-named active wishes near the same location? 
        // Or just let them wish multiple times. For simplicity, just create it.
        
        try {
            const wish = this.wishlistRepository.create({
                itemName: dto.itemName,
                description: dto.description,
                user: { id: userId } as any,
                location: {
                    type: 'Point',
                    coordinates: [dto.lon, dto.lat]
                }
            });
            
            await this.wishlistRepository.save(wish);
            return {
                statusCode: ResponseCode.SUCCESS,
                message: 'Wishlist item created successfully',
                data: wish
            };
        } catch (error) {
            this.logger.error(`Failed to create wish: ${error.message}`);
            return {
                statusCode: ResponseCode.BAD_REQUEST,
                message: 'Failed to create wishlist item'
            };
        }
    }

    async getUserWishes(userId: string) {
        const wishes = await this.wishlistRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });

        return {
            statusCode: ResponseCode.SUCCESS,
            data: wishes
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
            statusCode: ResponseCode.SUCCESS,
            message: 'Wishlist item deleted successfully'
        };
    }

    // Vendor exploration using PostGIS ST_DWithin
    async exploreLocalDemand(lat: number, lon: number, radiusMeters: number = 5000) {
        const locationGeoJSON = {
            type: 'Point',
            coordinates: [lon, lat]
        };

        const demands = await this.wishlistRepository.createQueryBuilder('wish')
            .where('wish.status = :status', { status: WishlistStatus.PENDING })
            .andWhere('ST_DWithin(wish.location, ST_SetSRID(ST_GeomFromGeoJSON(:location), 4326)::geography, :radius)', {
                location: JSON.stringify(locationGeoJSON),
                radius: radiusMeters
            })
            .orderBy('wish.createdAt', 'DESC')
            .limit(50) // Limit to 50 recent local demands
            .getMany();

        return {
            statusCode: ResponseCode.SUCCESS,
            data: demands
        };
    }
}
