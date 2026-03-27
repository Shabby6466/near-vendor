import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CloudinaryService } from "@utils/cloudinary/cloudinary.service";

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File | string, folder?: string) {
    try {
      const result = await this.cloudinaryService.uploadImage(file, { folder });
      if (!result.success) {
        throw new InternalServerErrorException(result.error || "Upload failed");
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Failed to upload image");
    }
  }

  async uploadImageSimple(file: Express.Multer.File | string) {
    const result = await this.uploadImage(file);
    return { url: result.imageUrl };
  }

  async getImage(publicId: string) {
    try {
      const result = await this.cloudinaryService.getImageUrl(publicId);
      if (!result.success) {
        throw new InternalServerErrorException(result.error || "Failed to get image");
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Failed to retrieve image");
    }
  }
}
