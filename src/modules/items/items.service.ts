import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { CreateItemDto } from "./dto/item.dto";
import { ShopService } from "@modules/shop/shop.service";
import { ShopNotFoundException } from "@modules/shop/shop.exception";
import { ItemNotFoundException } from "./item.exception";


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        private readonly shopService: ShopService,
    ) { }

    async findById(id: string): Promise<Item> {
        const item = await this.itemRepo.findOne({
            where: { id },
            relations: ['shop']
        });
        if (!item) throw new ItemNotFoundException();
        return item;
    }

    async createItem(vendorId: string, itemDto: CreateItemDto, shopId: string) {
        const shop = await this.shopService.findByVendorAndId(shopId, vendorId);

        const newItem = this.itemRepo.create({
            ...itemDto,
            shop,
        });

        return await this.itemRepo.save(newItem);
    }

    async updateItem(id: string, updateDto: CreateItemDto, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            }
        });

        if (!item) throw new ItemNotFoundException();

        Object.assign(item, updateDto);
        return await this.itemRepo.save(item);
    }

    async deleteItem(id: string, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            }
        });

        if (!item) throw new ItemNotFoundException();

        return await this.itemRepo.softRemove(item);
    }

    async getAllByShopId(vendorId: string, shopId: string) {
        const items = await this.itemRepo.find({
            where: {
                shop: {
                    id: shopId,
                    vendorProfile: { user: { id: vendorId } }
                }
            },
            relations: ['shop']
        });

        if (items.length === 0) {
            await this.shopService.findByVendorAndId(shopId, vendorId);
        }

        return items;
    }

    async searchVendorInventory(vendorId: string, shopId: string, searchTerm: string) {
        await this.shopService.findByVendorAndId(shopId, vendorId);

        return this.itemRepo.find({
            where: {
                shop: { id: shopId },
                name: ILike(`%${searchTerm}%`)
            },
            order: { name: 'ASC' }
        });
    }

    async searchNearby(query: string, lat: number, lon: number, radius: number = 5000, page: number = 1, limit: number = 10) {
        const queryBuilder = this.itemRepo.createQueryBuilder('item')
            .innerJoinAndSelect('item.shop', 'shop')
            .where('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)')
            .andWhere('(item.name ILIKE :query OR item.description ILIKE :query)')
            .andWhere('shop.isActive = :shopActive', { shopActive: true })
            .andWhere('item.isAvailable = :itemAvailable', { itemAvailable: true })
            .setParameters({
                lon,
                lat,
                radius,
                query: `%${query}%`,
            })
            .orderBy('ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)', 'ASC')
            .take(limit)
            .skip((page - 1) * limit);

        return await queryBuilder.getMany();
    }

}