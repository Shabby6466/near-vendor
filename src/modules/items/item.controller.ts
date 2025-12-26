import { Controller } from "@nestjs/common";
import { ItemService } from "./items.service";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("items")
@ApiCookieAuth()
@ApiBearerAuth()
@Controller("item")
export class ItemController {
    constructor(private readonly service: ItemService) { }


}