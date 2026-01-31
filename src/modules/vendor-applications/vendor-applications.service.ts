import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VendorApplication, VendorApplicationStatus } from "models/entities/vendor-applications.entity";
import { ApplyVendorDto } from "./dto/apply-vendor.dto";

@Injectable()
export class VendorApplicationsService {
  constructor(
    @InjectRepository(VendorApplication)
    private readonly repo: Repository<VendorApplication>
  ) {}

  async apply(dto: ApplyVendorDto) {
    const app = this.repo.create({
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      whatsappNumber: dto.whatsappNumber,
      shopName: dto.shopName,
      shopAddress: dto.shopAddress,
      shopLatitude: dto.shopLatitude as any,
      shopLongitude: dto.shopLongitude as any,
      shopImageUrl: dto.shopImageUrl,
      status: VendorApplicationStatus.PENDING,
    });

    const saved = await this.repo.save(app);

    return {
      success: true,
      applicationId: saved.id,
      status: saved.status,
      message: "Application received. Our team will review and contact you on WhatsApp.",
    };
  }
}
