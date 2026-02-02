import { CustomHttpException } from "@utils/helper";
export declare class InvalidPortalRoleException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
