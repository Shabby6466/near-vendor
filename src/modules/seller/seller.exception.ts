import { ResponseCode, ResponseMessage } from "@utils/enum";
import { Exception } from "@utils/helper";


export class SellerNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.SELLER_NOT_FOUND, ResponseMessage.SELLER_NOT_FOUND);
    }
}
