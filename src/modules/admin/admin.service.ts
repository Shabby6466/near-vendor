import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { UserService } from "@modules/users/users.service";
import { VendorService } from "@modules/vendor/vendor.service";
import { AuthService } from "@modules/auth/auth.service";
import { UserRoles } from "@utils/enum";
import { WishlistService } from "@modules/wishlist/wishlist.service";
import { HistoryService } from "@modules/history/history.service";
import { AnalyticsService } from "@modules/analytics/analytics.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(VendorApplication) private readonly apps: Repository<VendorApplication>,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
    private readonly authService: AuthService,
    private readonly wishlistService: WishlistService,
    private readonly historyService: HistoryService,
    private readonly analyticsService: AnalyticsService,
  ) { }


  async getAllUsers(page: number = 1, limit: number = 20) {
    const { users, total } = await this.userService.findAllUsers(page, limit);
    return {
      success: true,
      statusCode: 200,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getAllVendors(status?: string, page: number = 1, limit: number = 20) {
    const { vendors, total } = await this.vendorService.findAllVendors(status, page, limit);
    return {
      success: true,
      statusCode: 200,
      data: {
        vendors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getVendorById(id: string) {
    const vendor = await this.vendorService.getVendorById(id);
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }

    return {
      success: true,
      statusCode: 200,
      data: vendor
    };
  }

  async getPendingVendors() {
    const result = await this.vendorService.getPendingVendors();
    return { success: true, statusCode: 200, data: (result as any).data || result };
  }

  async approveVendor(vendorId: string) {
    const result = await this.vendorService.approveVendor(vendorId);
    return { success: true, statusCode: 200, data: (result as any).data || null };
  }

  async adminLogin(dto: any) {
    const res: any = await this.authService.login(dto);
    if (res?.user?.role !== UserRoles.SUPERADMIN) {
      throw new BadRequestException("Invalid portal role");
    }
    return res;
  }

  async getBuyerDetail(userId: string, page: number = 1, limit: number = 20) {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.role !== UserRoles.BUYER) {
      throw new BadRequestException("User is not a buyer");
    }

    // Fetch related paginated data using services
    const wishlistRes = await this.wishlistService.getUserWishes(userId, page, limit);
    const wishlist = wishlistRes.data.items;
    const wishlistTotal = wishlistRes.data.meta.totalItems;

    const { items: searchHistory, total: searchHistoryTotal } = await this.historyService.getUserSearchHistory(userId, page, limit);
    const { items: recentItems, total: recentItemsTotal } = await this.historyService.getUserRecentItems(userId, page, limit);
    const { items: analyticsEvents, total: analyticsEventsTotal } = await this.analyticsService.getUserEvents(userId, page, limit);

    return {
      success: true,
      statusCode: 200,
      data: {
        user,
        wishlist: {
          items: wishlist,
          pagination: {
            page,
            limit,
            total: wishlistTotal,
            totalPages: Math.ceil(wishlistTotal / limit)
          }
        },
        searchHistory: {
          items: searchHistory,
          pagination: {
            page,
            limit,
            total: searchHistoryTotal,
            totalPages: Math.ceil(searchHistoryTotal / limit)
          }
        },
        recentItems: {
          items: recentItems,
          pagination: {
            page,
            limit,
            total: recentItemsTotal,
            totalPages: Math.ceil(recentItemsTotal / limit)
          }
        },
        analyticsEvents: {
          items: analyticsEvents,
          pagination: {
            page,
            limit,
            total: analyticsEventsTotal,
            totalPages: Math.ceil(analyticsEventsTotal / limit)
          }
        }
      }
    };
  }
}


