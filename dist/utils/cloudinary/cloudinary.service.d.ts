/// <reference types="multer" />
export declare class CloudinaryService {
    private configured;
    private ensureConfigured;
    isEnabled(): boolean;
    uploadImage(file: Express.Multer.File, opts?: {
        folder?: string;
        publicId?: string;
    }): Promise<{
        success: boolean;
        error: string;
        imageUrl?: undefined;
        publicId?: undefined;
    } | {
        success: boolean;
        imageUrl: any;
        publicId: any;
        error?: undefined;
    }>;
}
