import { Repository } from "typeorm";
import { InventoryItem } from "../../models/entities/inventory-item.entity";
export declare class SearchService {
    private readonly repo;
    constructor(repo: Repository<InventoryItem>);
    search(params: {
        queryText: string;
        userLat: number;
        userLon: number;
        limit: number;
    }): Promise<{
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
    }[]>;
    private mapRows;
    alternatives(params: {
        queryText: string;
        userLat: number;
        userLon: number;
        limit: number;
    }): Promise<{
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
    }[]>;
    nearby(params: {
        userLat: number;
        userLon: number;
        limit: number;
    }): Promise<{
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
    }[]>;
    shopInventory(params: {
        shopId: string;
        userLat: number | null;
        userLon: number | null;
        limit: number;
    }): Promise<{
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
    }>;
}
