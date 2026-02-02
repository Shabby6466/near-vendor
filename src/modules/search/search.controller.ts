import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "@utils/s3/s3.service";
import { SearchService } from "./search.service";
import { SearchDto } from "./dto/search.dto";
import { SearchImageDto } from "./dto/search-image.dto";
import { NearbyDto } from "./dto/nearby.dto";
import { GeminiVisionService } from "./gemini-vision.service";
import { ImageCacheService } from "./image-cache.service";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(
    private readonly service: SearchService,
    private readonly vision: GeminiVisionService,
    private readonly cache: ImageCacheService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Search inventory (text search)" })
  async search(@Body() dto: SearchDto) {
    const queryText = (dto.queryText || "").trim();

    const results = await this.service.search({
      queryText,
      userLat: dto.userLat,
      userLon: dto.userLon,
      limit: dto.limit ?? 20,
    });

    // If no exact match, show related alternatives (token matches).
    // Never dump the whole DB when query is empty.
    const alternatives = results.length
      ? []
      : await this.service.alternatives({
          queryText,
          userLat: dto.userLat,
          userLon: dto.userLon,
          limit: Math.min(dto.limit ?? 20, 12),
        });

    return { success: true, results, alternatives, normalizedQuery: queryText };
  }

  @Post("nearby")
  @ApiOperation({ summary: "Explore nearby inventory (no query). Use for Explore CTA." })
  async nearby(@Body() dto: NearbyDto) {
    const results = await this.service.nearby({
      userLat: dto.userLat,
      userLon: dto.userLon,
      limit: Math.min(dto.limit ?? 30, 50),
    });

    return { success: true, results, alternatives: [], normalizedQuery: "" };
  }

  @Get("shop/:id")
  @ApiOperation({ summary: "Public: get a shop and its inventory (nearby-ranked)" })
  async shopInventory(
    @Param("id") id: string,
    @Query("userLat") userLatRaw?: string,
    @Query("userLon") userLonRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const userLat = userLatRaw ? Number(userLatRaw) : null;
    const userLon = userLonRaw ? Number(userLonRaw) : null;
    const limit = Math.min(limitRaw ? Number(limitRaw) : 100, 200);

    const out = await this.service.shopInventory({
      shopId: id,
      userLat,
      userLon,
      limit,
    });

    return { success: true, ...out };
  }

  @Post("image")
  @ApiOperation({ summary: "Search inventory by uploading an image (LLM/Vision -> description -> match inventory)" })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: S3Service.imageFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async searchByImage(@Body() dto: SearchImageDto, @UploadedFile() file: Express.Multer.File) {
    const hint = (dto.queryText || "").trim();
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    // Cache by sha256(image)
    const hash = this.vision.sha256(file.buffer);
    const cacheKey = `nv:imgdesc:${hash}`;
    const cached = await this.cache.get(cacheKey);

    const description = cached || (await this.vision.describeImage(file.buffer, file.mimetype, hint));
    if (!cached && description) {
      await this.cache.set(cacheKey, description, 60 * 60 * 24 * 7);
    }

    const results = await this.service.search({
      queryText: description,
      userLat: dto.userLat,
      userLon: dto.userLon,
      limit: dto.limit ?? 20,
    });

    const alternatives = results.length
      ? []
      : await this.service.alternatives({
          queryText: description,
          userLat: dto.userLat,
          userLon: dto.userLon,
          limit: Math.min(dto.limit ?? 20, 12),
        });

    return {
      success: true,
      results,
      alternatives,
      normalizedQuery: description,
    };

  }
}
