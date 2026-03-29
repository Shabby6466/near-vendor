import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get("get-all-names")
    @ApiOperation({
        summary: "Get all categories",
        description: "Returns a list of all category IDs and names available in the system.",
    })
    @ApiResponse({
        status: 200,
        description: "List of categories retrieved successfully.",
    })
    async getAllCategories(): Promise<{ id: string, name: string }[]> {
        return await this.categoriesService.getAllCategories();
    }
}
