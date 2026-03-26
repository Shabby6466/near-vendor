import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { Repository } from "typeorm";
import { CreateVendorDto, UpdateVendorDto } from "./dto/vendor.dto";
import { ResponseCode } from "@utils/enum";
import { UserService } from "@modules/users/users.service";

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(Vendors)
        private readonly vendorRepository: Repository<Vendors>,
        private readonly userService: UserService,
    ) { }

    async findById(id: string) {
        return await this.vendorRepository.findOne({
            where: { id },
        });
    }

    async findByUserId(userId: string) {
        return await this.vendorRepository.findOne({
            where: { user: { id: userId } },
        });
    }

    async createVendor(vendor: Vendors) {
        return await this.vendorRepository.save(vendor);
    }

    async registerVendor(vendorDto: CreateVendorDto, userId: string) {
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
        vendor.isVerified = true;
        await this.createVendor(vendor);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor approved successfully',
        }
    }

}