import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { CreateItemDto, ItemByIdResponseDto, ItemResponseDto, UpdateItemDto } from "./dto/item.dto";
import { ShopService } from "@modules/shop/shop.service";
import { ShopNotFoundException } from "@modules/shop/shop.exception";
import { ItemNotFoundException } from "./item.exception";
import { paginate, IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { ResponseCode } from "@utils/enum";


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

    async createItem(vendorId: string, itemDto: CreateItemDto) {
        const { shopId, ...rest } = itemDto;
        const shop = await this.shopService.findByVendorAndId(shopId, vendorId);

        const newItem = this.itemRepo.create({
            ...rest,
            shop,
        });

        await this.itemRepo.save(newItem);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Item created successfully',
        }
    }

    async updateItem(id: string, updateDto: UpdateItemDto, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            }
        });

        if (!item) throw new ItemNotFoundException();

        Object.assign(item, updateDto);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
        };
    }

    async deleteItem(id: string, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            }
        });

        if (!item) throw new ItemNotFoundException();

        await this.itemRepo.softRemove(item);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Item deleted successfully',
        };
    }

    async getAllItemsByShopId(shopId: string, options: IPaginationOptions): Promise<any> {
        const queryBuilder = this.itemRepo.createQueryBuilder('item')
            .leftJoinAndSelect('item.shop', 'shop')
            .where('shop.id = :shopId', { shopId });

        const paginatedItems = await paginate<Item>(queryBuilder, options);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: new Pagination<ItemResponseDto>(
                paginatedItems.items.map((item) => ItemResponseDto.fromEntity(item)),
                paginatedItems.meta,
                paginatedItems.links,
            ),
        };
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
            .addSelect('ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)', 'distance')
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
            .orderBy('distance', 'ASC')
            .take(limit)
            .skip((page - 1) * limit);

        const items = await queryBuilder.getMany();
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: items,
        };
    }

    async getItemById(id: string) {
        const item = await this.itemRepo.findOne({
            where: { id },
            relations: ['shop']
        });
        if (!item) throw new ItemNotFoundException();
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: ItemByIdResponseDto.fromEntity(item),
        };
    }

}