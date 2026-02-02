import { HttpException } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '@utils/enum';
import { ApiQueryFilters } from '../../models/models';
import { PaginationMeta } from '@modules/common/responses';
export declare const generateOTP: () => number;
export declare const generateRandomIndex: () => number;
export declare class CustomHttpException extends HttpException {
    constructor(responseCode: ResponseCode, responseMessage: ResponseMessage, status?: number);
}
export declare class Exception {
    constructor(responseCode?: ResponseCode, responseMessage?: ResponseMessage);
}
export declare const generateRandomString: (length: any, isNumeric?: boolean) => string;
export declare function withPagination<T>(params: ApiQueryFilters): {
    meta: PaginationMeta;
    data: T[];
};
