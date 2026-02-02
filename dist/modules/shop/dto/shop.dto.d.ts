export declare class CreateShopDto {
    shopName: string;
    shopImageUrl: string;
    latitude: number;
    longitude: number;
}
declare const UpdateShopDto_base: import("@nestjs/common").Type<Partial<CreateShopDto>>;
export declare class UpdateShopDto extends UpdateShopDto_base {
    shopName?: string;
    shopImageUrl?: string;
    shopAddress?: string;
    whatsappNumber?: string;
}
export {};
