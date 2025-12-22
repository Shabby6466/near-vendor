import { ResponseCode, ResponseMessage } from "@utils/enum";
import { Exception } from "@utils/helper";

export class PhoneNumberNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.BUYER_PHONE_NUMBER_NOT_FOUND, ResponseMessage.BUYER_PHONE_NUMBER_NOT_FOUND);
    }
}

export class BuyerNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.BUYER_PHONE_NUMBER_NOT_FOUND, ResponseMessage.BUYER_PHONE_NUMBER_NOT_FOUND);
    }
}