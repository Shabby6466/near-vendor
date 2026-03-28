import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "models/entities/categories.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async getAllCategoryNames(): Promise<string[]> {
        const categories = await this.categoryRepo.find({
            select: ["categoryName"],
            order: { categoryName: "ASC" },
        });
        return categories.map((c) => c.categoryName);
    }
}
