import { ResponseMessage } from '../../utils/enum';
import { Response } from '../../response/response';
declare class SuccessData {
    url: string | string[];
}
export declare class SuccessMediaResponse extends Response {
    constructor(url: string | string[]);
    data: SuccessData;
}
export declare class InvalidFileFormat {
    statusCode: number;
    message: string;
    errors: ResponseMessage.INVALID_FILE_FORMAT;
}
export {};
