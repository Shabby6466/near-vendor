/// <reference types="multer" />
import { SearchService } from "./search.service";
import { SearchDto } from "./dto/search.dto";
import { SearchImageDto } from "./dto/search-image.dto";
import { NearbyDto } from "./dto/nearby.dto";
import { GeminiVisionService } from "./gemini-vision.service";
import { ImageCacheService } from "./image-cache.service";
export declare class SearchController {
    private readonly service;
    private readonly vision;
    private readonly cache;
    constructor(service: SearchService, vision: GeminiVisionService, cache: ImageCacheService);
    search(dto: SearchDto): Promise<{
        success: boolean;
        results: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        alternatives: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        normalizedQuery: string;
    }>;
    nearby(dto: NearbyDto): Promise<{
        success: boolean;
        results: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        alternatives: any[];
        normalizedQuery: string;
    }>;
    shopInventory(id: string, userLatRaw?: string, userLonRaw?: string, limitRaw?: string): Promise<{
        shop: {
            id: string;
            shopName: any;
            shopImageUrl: any;
            shopLatitude: any;
            shopLongitude: any;
            shopAddress: any;
            whatsappNumber: any;
            isActive: any;
        };
        distanceMeters: number;
        items: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        success: boolean;
    }>;
    searchByImage(dto: SearchImageDto, file: Express.Multer.File): Promise<{
        success: boolean;
        error: string;
        results?: undefined;
        alternatives?: undefined;
        normalizedQuery?: undefined;
    } | {
        success: boolean;
        results: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        alternatives: {
            itemId: string;
            name: string;
            description: string;
            imageUrl: string;
            price: number;
            stock: number;
            shop: {
                id: string;
                shopName: any;
                shopImageUrl: any;
                shopLatitude: any;
                shopLongitude: any;
                shopAddress: any;
                whatsappNumber: any;
                isActive: any;
            };
            distanceMeters: number;
        }[];
        normalizedQuery: string;
        error?: undefined;
    }>;
}
