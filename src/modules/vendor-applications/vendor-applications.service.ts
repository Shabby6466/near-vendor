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

  async uploadShopImage(file: Express.Multer.File) {
    if (!file) return { success: false, error: "No file uploaded" };

    // Prefer Cloudinary if configured
    const hasCloudinary =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      const { CloudinaryService } = await import("@utils/cloudinary/cloudinary.service");
      const cloud = new CloudinaryService();
      const uploaded = await cloud.uploadImage(file, { folder: process.env.CLOUDINARY_FOLDER ?? "nearvendor/shops" });
      if (uploaded?.success) return { success: true, imageUrl: uploaded.imageUrl };
      // fall through if upload fails
    }

    const hasAws =
      !!process.env.AWS_BUCKET_NAME &&
      !!process.env.AWS_REGION &&
      !!process.env.AWS_ACCESS_KEY &&
      !!process.env.AWS_SECRET_KEY;

    if (hasAws) {
      const { S3Service } = await import("@utils/s3/s3.service");
      const s3 = new S3Service();
      const uploaded: any = await s3.upload(file);
      return { success: true, imageUrl: uploaded?.Location || null };
    }

    const fs = await import("fs");
    const path = await import("path");

    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const safe = String(file.originalname || "file")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(-80);
    const filename = `${Date.now()}_${Math.random().toString(16).slice(2)}_${safe}`;
    const outPath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(outPath, file.buffer);

    return { success: true, imageUrl: `/uploads/${filename}` };
  }

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
