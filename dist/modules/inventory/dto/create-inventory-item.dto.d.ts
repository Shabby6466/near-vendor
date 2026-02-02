export declare class CreateInventoryItemDto {
    name: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    stock: number;
    isActive?: boolean;
    tags?: string;
    shopId: string;
}
declare const UpdateInventoryItemDto_base: import("@nestjs/common").Type<Partial<CreateInventoryItemDto>>;
export declare class UpdateInventoryItemDto extends UpdateInventoryItemDto_base {
}
export {};
