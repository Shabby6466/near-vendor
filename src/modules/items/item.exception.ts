import { Exception } from "@utils/helper";
import { ResponseCode, ResponseMessage } from "@utils/enum";

export class ItemNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.ITEM_NOT_FOUND, ResponseMessage.ITEM_NOT_FOUND);
    }
}
export class ItemAlreadyExistsException extends Exception {
    constructor() {
        super(ResponseCode.ITEM_ALREADY_EXISTS, ResponseMessage.ITEM_ALREADY_EXISTS);
    }
}