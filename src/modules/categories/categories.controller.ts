import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get("get-all-names")
    @ApiOperation({
        summary: "Get all category names",
        description: "Returns a list of all category names available in the system.",
    })
    @ApiResponse({
        status: 200,
        description: "List of category names retrieved successfully.",
        type: [String],
    })
    async getAllCategoryNames(): Promise<string[]> {
        return await this.categoriesService.getAllCategoryNames();
    }
}
