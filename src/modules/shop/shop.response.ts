import { Response } from "response/response";

export class CreateShopResponse extends Response {
    message: string;
    constructor() {
        super();
        this.message = "Shop created successfully";
    }
}