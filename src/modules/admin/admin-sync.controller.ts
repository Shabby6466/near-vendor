import { Controller, Post, Headers, HttpException, HttpStatus, Logger, UseGuards, Req } from "@nestjs/common";
import { ItemService } from "@modules/items/items.service";
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from "@nestjs/swagger";
import { OptionalAuthGuard } from "@modules/auth/auth-utils/optional-guard";
import { UserRoles } from "@utils/enum";

@ApiTags("admin")
@ApiBearerAuth()
@Controller("admin/sync")
@UseGuards(OptionalAuthGuard)
export class AdminSyncController {
  private readonly logger = new Logger(AdminSyncController.name);

  constructor(
    private readonly itemService: ItemService,
  ) { }

  @Post("embeddings")
  @ApiOperation({ summary: "Synchronize item embeddings (Admin only)" })
  @ApiHeader({ name: "x-admin-secret", description: "Admin secret key (optional if using JWT)" })
  async syncEmbeddings(
    @Headers("x-admin-secret") secret: string,
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

    this.logger.log(`Starting bulk embedding sync...`);
    return await this.itemService.syncAllEmbeddings();
  }
}
