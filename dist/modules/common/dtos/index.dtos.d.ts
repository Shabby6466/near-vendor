export declare enum SortBy {
    CREATED_AT = "createdAt"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class PaginationDto {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    sort?: SortOrder;
    limit?: number;
}
export declare class UUIDDto {
    uuid: string;
}
export declare class PageMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    constructor(page: number, limit: number, total: number);
}
export declare class PaginatedResponse<T> extends Response {
    data: T[];
    meta: PageMetaDto;
    constructor(data: T[], page: number, limit: number, total: number);
}
