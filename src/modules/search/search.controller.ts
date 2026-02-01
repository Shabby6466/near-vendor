import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { SearchDto } from "./dto/search.dto";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Post()
  @ApiOperation({ summary: "Search inventory (text/image placeholder)" })
  async search(@Body() dto: SearchDto) {
    const queryText = (dto.queryText || "").trim();

    // Image search MVP: for now we require queryText.
    // Next step: if imageUrl provided, call an LLM/Vision model to describe it then use that as queryText.
    if (!queryText && dto.imageUrl) {
      return {
        success: false,
        error: "imageUrl search not enabled yet in MVP backend. Provide queryText for now.",
      };
    }

    const results = await this.service.search({
      queryText,
      userLat: dto.userLat,
      userLon: dto.userLon,
      limit: dto.limit ?? 20,
    });

    // If no exact match, show nearby alternatives so buyer doesn't hit a dead end.
    const alternatives = results.length
      ? []
      : await this.service.alternatives({
          userLat: dto.userLat,
          userLon: dto.userLon,
          limit: Math.min(dto.limit ?? 20, 12),
        });

    return { success: true, results, alternatives };
  }
}
