import { Response } from '../../../response/response';
export declare class InternalServerError {
    message: string;
    statusCode: number;
}
export declare class Unauthenticated {
    message: string;
    statusCode: number;
}
export declare class PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}
export declare class SuccessResponse extends Response {
    constructor();
}
