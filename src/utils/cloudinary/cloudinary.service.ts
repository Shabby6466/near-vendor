import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  private configured = false;

  private ensureConfigured() {
    if (this.configured) return;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) return;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    this.configured = true;
  }

  isEnabled() {
    return !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;
  }

  async uploadImage(file: Express.Multer.File, opts?: { folder?: string; publicId?: string }) {
    if (!file) return { success: false, error: "No file uploaded" };

    this.ensureConfigured();
    if (!this.isEnabled()) return { success: false, error: "Cloudinary not configured" };

    const folder = opts?.folder ?? process.env.CLOUDINARY_FOLDER ?? "nearvendor";

    const res = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: opts?.publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    return {
      success: true,
      imageUrl: res?.secure_url || res?.url || null,
      publicId: res?.public_id || null,
    };
  }
}
