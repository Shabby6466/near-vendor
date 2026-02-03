import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
  @ApiOperation({ summary: "Search inventory (keyword + FTS search)" })
  async search(@Body() body: NearbyDto) {
    const results = await this.service.search({
      queryText: body.queryText || "",
      userLat: body.userLat,
      userLon: body.userLon,
      limit: body.limit || 60,
    });
    return { success: true, results };
  }

  @Post("/semantic")
  @ApiOperation({ summary: "Search inventory (AI semantic search)" })
  async semanticSearch(@Body() body: NearbyDto) {
    const results = await this.service.semanticSearch({
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

  @Post("/image")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Search inventory using an image (AI vision)" })
  async searchImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const results = await this.service.searchImage({
      file: file.buffer,
      mimeType: file.mimetype,
      userLat: parseFloat(body.userLat),
      userLon: parseFloat(body.userLon),
      limit: body.limit ? parseInt(body.limit, 10) : 20,
      queryText: body.queryText,
    });
    return { success: true, ...results };
  }
}
