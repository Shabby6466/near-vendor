import { Exception } from "@utils/helper";
import { ResponseCode, ResponseMessage } from "@utils/enum";

export class NoNearbyShopsException extends Exception {
    constructor() {
        super(ResponseCode.NOT_FOUND, ResponseMessage.NO_NEARBY_SHOPS);
    }
}