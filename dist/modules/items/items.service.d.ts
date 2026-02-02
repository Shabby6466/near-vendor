import { Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
export declare class ItemService {
    private readonly itemRepo;
    constructor(itemRepo: Repository<Item>);
}
