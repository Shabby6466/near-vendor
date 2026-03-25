import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vendors } from "../../models/entities/vendors.entity";
import { Repository } from "typeorm";
import { CreateVendorDto, UpdateVendorDto } from "./dto/vendor.dto";
import { ResponseCode } from "@utils/enum";

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(Vendors)
        private readonly vendorRepository: Repository<Vendors>,
    ) { }

    async findById(id: string) {
        return await this.vendorRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async createVendor(vendor: Vendors) {
        return await this.vendorRepository.save(vendor);
    }

    async registerVendor(vendorDto: CreateVendorDto) {
        const vendor = await this.vendorRepository.create(vendorDto);
        await this.createVendor(vendor);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor registered successfully',
        }
    }

    async getVendorMeProfile(vendorId: string) {
        const vendor = await this.findById(vendorId);
        return {
            statusCode: ResponseCode.SUCCESS,
            message: 'Vendor profile fetched successfully',
            data: vendor,
        }
    }

    async updateVendorProfile(vendorId: string, vendorDto: UpdateVendorDto) {
        const vendor = await this.findById(vendorId);
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

    async getMeVendorStatus(vendorId: string) {
        const vendor = await this.findById(vendorId);
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

}