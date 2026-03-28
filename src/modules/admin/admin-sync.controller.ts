import { Controller, Post, Headers, HttpException, HttpStatus, Query, Logger, UseGuards, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { AIService } from "@modules/ai/ai.service";
import { ApiTags, ApiOperation, ApiHeader, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/auth/auth-utils/jwt-guard";
import { UserRoles } from "@utils/enum";

@ApiTags("admin")
@ApiBearerAuth()
@Controller("admin/sync")
export class AdminSyncController {
  private readonly logger = new Logger(AdminSyncController.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    private readonly aiService: AIService,
  ) { }

  @Post("embeddings")
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Synchronize item embeddings (Admin only)" })
  @ApiHeader({ name: "x-admin-secret", description: "Admin secret key (optional if using JWT)" })
  @ApiQuery({ name: "force", required: false, type: Boolean, description: "Force regenerate all embeddings" })
  async syncEmbeddings(
    @Headers("x-admin-secret") secret: string,
    @Query("force") force: string,
    @Req() req: any
  ) {
    const adminSecret = process.env.ADMIN_SYNC_SECRET || "supersecret";
    
    // Allow either secret key OR authenticated SUPERADMIN
    const isAuthorized = 
        (secret && secret === adminSecret) || 
        (req.user && req.user.role === UserRoles.SUPERADMIN);

    if (!isAuthorized) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const isForce = force === "true";

    // Find items that need embeddings
    const items = await this.itemRepo.find({
      where: isForce ? {} : { embedding: null },
      select: ["id", "name", "description"]
    });

    this.logger.log(`Starting sync for ${items.length} items...`);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      try {
        const text = `${item.name} ${item.description || ""}`;
        const embedding = await this.aiService.generateEmbedding(text);
        
        // Use raw query to ensure the embedding is cast correctly to vector in DB
        await this.itemRepo.query(
            `UPDATE items SET embedding = $1::vector WHERE id = $2`,
            [`[${embedding.join(",")}]`, item.id]
        );
        
        successCount++;

        if (successCount % 10 === 0) {
          this.logger.log(`Synced ${successCount} items...`);
        }
      } catch (error) {
        this.logger.error(`Failed to sync item ${item.id}: ${error.message}`, error.stack);
        failCount++;
      }
    }

    return {
      success: true,
      message: `Sync completed. ${successCount} succeeded, ${failCount} failed.`,
      totalProcessed: items.length
    };
  }
}
