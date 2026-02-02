import express from 'express';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
export declare class Pagination {
    static readonly limit_page_size: number;
    static paginate(req: express.Request, res: express.Response): Promise<IPaginationOptions>;
    static isInteger(value: string): boolean;
    static isPositiveInteger(value: string): boolean;
    static isNegativeInteger(value: string): boolean;
}
