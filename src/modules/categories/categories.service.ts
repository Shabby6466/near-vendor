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

    async getAllCategories(): Promise<{id: string, name: string}[]> {
        const categories = await this.categoryRepo.find({
            select: ["id", "categoryName"],
            order: { categoryName: "ASC" },
        });
        return categories.map((c) => ({
            id: c.id,
            name: c.categoryName
        }));
    }

    async getSuggestedCategories(query: string, limit: number = 5): Promise<Category[]> {
        return this.categoryRepo.createQueryBuilder('category')
            .where('category.categoryName % :query', { query })
            .take(limit)
            .getMany();
    }
}
