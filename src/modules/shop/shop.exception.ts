import { Exception } from "@utils/helper";
import { ResponseCode, ResponseMessage } from "@utils/enum";

export class ShopNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.SHOP_NOT_FOUND, ResponseMessage.SHOP_NOT_FOUND);
    }
}