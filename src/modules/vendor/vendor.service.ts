import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { Repository, ILike } from "typeorm";
import { CreateVendorDto, UpdateVendorDto } from "./dto/vendor.dto";
import { ResponseCode, UserRoles } from "@utils/enum";
import { UserService } from "@modules/users/users.service";
import { Shops } from "models/entities/shops.entity";
import { Item } from "models/entities/items.entity";
import { AnalyticsService } from "@modules/analytics/analytics.service";

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(Vendors)
        private readonly vendorRepository: Repository<Vendors>,
        @InjectRepository(Shops)
        private readonly shopRepository: Repository<Shops>,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AnalyticsService))
        private readonly analyticsService: AnalyticsService,
    ) { }

    async findById(id: string) {
        return await this.vendorRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async findByUserId(userId: string) {
        return await this.vendorRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async createVendor(vendor: Vendors) {
        return await this.vendorRepository.save(vendor);
    }

    async registerVendor(vendorDto: CreateVendorDto, userId: string) {
        const existingVendor = await this.findByUserId(userId);
        if (existingVendor) {
            return {
                statusCode: ResponseCode.BAD_REQUEST,
                message: 'Vendor profile already exists for this user',
            }
        }
        const vendor = this.vendorRepository.create(vendorDto);
        vendor.businessType = vendorDto.businessCategory;
        vendor.status = 'PENDING';
        vendor.isVerified = false;
        vendor.cnic = vendorDto.cnic || '';
        vendor.cnicImageUrl = vendorDto.cnicImageUrl || '';
        vendor.user = { id: userId } as any;
        await this.createVendor(vendor);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor registered successfully',
        }
    }

    async updateVendorProfile(userId: string, vendorDto: UpdateVendorDto) {
        const vendor = await this.findByUserId(userId);
        if (!vendor) {
            return {
                statusCode: ResponseCode.NOT_FOUND,
                message: 'Vendor not found',
            }
        }
        vendor.businessName = vendorDto.businessName;
        vendor.businessType = vendorDto.businessCategory;
        vendor.taxId = vendorDto.taxId;
        vendor.supportContact = vendorDto.supportContact;
        await this.createVendor(vendor);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor profile updated successfully',
        }
    }

    async getMeVendorStatus(userId: string) {
        const vendor = await this.findByUserId(userId);
        if (!vendor) {
            return {
                statusCode: ResponseCode.NOT_FOUND,
                message: 'Vendor not found',
            }
        }
        return {
            statusCode: ResponseCode.SUCCESS,
            data: vendor.status,
        }
    }

    async getMeVendorProfile(userId: string) {
        const user = await this.userService.getUser(userId);
        const vendor = await this.findByUserId(userId);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor profile fetched successfully',
            data: { ...user, ...vendor },
        }
    }

    async getPendingVendors() {
        const vendors = await this.vendorRepository.find({
            where: { status: 'PENDING' },
            relations: ['user'],
        });
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Pending vendor profiles fetched successfully',
            data: vendors,
        }
    }

    async approveVendor(vendorId: string) {
        const vendor = await this.findById(vendorId);
        if (!vendor) {
            return {
                statusCode: ResponseCode.NOT_FOUND,
                message: 'Vendor not found',
            }
        }
        vendor.status = 'APPROVED';
        await this.userService.updateUserRole(vendor.user.id, UserRoles.VENDOR);
        vendor.isVerified = true;
        await this.createVendor(vendor);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor approved successfully',
        }
    }

    async searchPortfolio(userId: string, query: string, page: number = 1, limit: number = 10) {
        const vendor = await this.findByUserId(userId);
        if (!vendor) return { statusCode: ResponseCode.NOT_FOUND, message: 'Vendor not found' };

        const skip = (page - 1) * limit;

        const [shops, totalShops] = await this.shopRepository.findAndCount({
            where: {
                vendorProfile: { id: vendor.id },
                shopName: ILike(`%${query}%`)
            },
            take: limit,
            skip: skip
        });

        const [items, totalItems] = await this.itemRepository.findAndCount({
            where: {
                shop: { vendorProfile: { id: vendor.id } },
                name: ILike(`%${query}%`)
            },
            relations: ['shop'],
            select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stockCount: true,
                shop: {
                    id: true,
                    shopName: true
                }
            },
            take: limit,
            skip: skip
        });

        return {
            statusCode: ResponseCode.SUCCESS,
            data: {
                shops,
                items,
                pagination: {
                    page,
                    limit,
                    totalShops,
                    totalItems,
                    totalPageShops: Math.ceil(totalShops / limit),
                    totalPageItems: Math.ceil(totalItems / limit)
                }
            }
        };
    }

    async getPortfolioPerformance(userId: string, days: number = 30) {
        const vendor = await this.findByUserId(userId);
        if (!vendor) return { statusCode: ResponseCode.NOT_FOUND, message: 'Vendor not found' };

        const shops = await this.shopRepository.find({
            where: { vendorProfile: { id: vendor.id } },
            select: ['id']
        });

        const shopIds = shops.map(s => s.id);
        const performance = await this.analyticsService.getItemPerformance(shopIds, days);

        // Map results back to item details
        const topItemDetails = await Promise.all(
            performance.topItems.map(async (p: any) => {
                const item = await this.itemRepository.findOne({ 
                    where: { id: p.itemId },
                    relations: ['shop'],
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        imageUrl: true,
                        stockCount: true,
                        shop: {
                            id: true,
                            shopName: true
                        }
                    }
                });
                return item ? { ...item, count: parseInt(p.count) } : null;
            })
        );

        const poorItemDetails = await Promise.all(
            performance.poorItems.map(async (p: any) => {
                const item = await this.itemRepository.findOne({ 
                    where: { id: p.itemId },
                    relations: ['shop'],
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        imageUrl: true,
                        stockCount: true,
                        shop: {
                            id: true,
                            shopName: true
                        }
                    }
                });
                return item ? { ...item, count: parseInt(p.count) } : null;
            })
        );

        return {
            statusCode: ResponseCode.SUCCESS,
            data: {
                bestPerformers: topItemDetails.filter(i => i !== null),
                poorPerformers: poorItemDetails.filter(i => i !== null)
            }
        };
    }

    async findAllVendors(status?: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (status) where.status = status;
        
        const [vendors, total] = await this.vendorRepository.findAndCount({
            where,
            relations: ['user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' } as any
        });
        return { vendors, total };
    }

    async getVendorById(id: string) {
        return await this.vendorRepository.findOne({ 
            where: { id },
            relations: ['user', 'shops']
        });
    }
}