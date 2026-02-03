import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { NearbyDto } from "./dto/nearby.dto";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(
    private readonly service: SearchService,
  ) { }

  @Post()
  @ApiOperation({ summary: "Search inventory (indexed keyword + distance)" })
  async search(@Body() body: NearbyDto) {
    const results = await this.service.search({
      queryText: body.queryText || "",
      userLat: body.userLat,
      userLon: body.userLon,
      limit: body.limit || 60,
    });
    return { success: true, results };
  }

  @Post("/nearby")
  @ApiOperation({ summary: "Explore nearby inventory (no query)" })
  async nearby(@Body() body: Omit<NearbyDto, "queryText">) {
    const results = await this.service.nearby({
      userLat: body.userLat,
      userLon: body.userLon,
      limit: body.limit || 60,
    });
    return { success: true, results };
  }
}
