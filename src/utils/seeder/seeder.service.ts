/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { LoggerService } from "@utils/logger/logger.service";
import { User } from "models/entities/users.entity";
import { UserRoles } from "@utils/enum";
import * as bcrypt from "bcryptjs";
import { Category } from "models/entities/categories.entity";

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource
  ) {
    this.seedData()
      .then((data) => Logger.log(data))
      .catch((err) => Logger.error(err));
  }

  async seedData() {
    await this.createSuperAdmin();
    await this.seedCategories();
  }

  private async createSuperAdmin() {
    const adminEmail = process.env.SUPERADMIN_EMAIL;
    const adminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      Logger.warn("SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD not set in .env — skipping admin seed");
      return;
    }

    const userRepo = this.dataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { email: adminEmail } });

    if (existing) {
      Logger.log(`Super admin already exists: ${adminEmail}`);
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = userRepo.create({
      fullName: "Super Admin",
      email: adminEmail,
      password: hashed,
      role: UserRoles.SUPERADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    await userRepo.save(admin);
    Logger.log(`✅ Super admin created: ${adminEmail}`);
  }

  private async seedCategories() {
    const categories = [
      "Electronics",
      "Fashion & Apparel items",
      "Pharmacy items",
      "Home & Living",
      "Flowers & Bouquets",
      "Home Maintainance",
      "Automotive items",
    ];

    const categoryRepo = this.dataSource.getRepository(Category);

    // Clean up categories with null names that caused sync issues
    await categoryRepo.createQueryBuilder()
      .delete()
      .where("categoryName IS NULL")
      .execute();

    for (const name of categories) {
      const existing = await categoryRepo.findOne({ where: { categoryName: name } });
      if (!existing) {
        const category = categoryRepo.create({ categoryName: name });
        await categoryRepo.save(category);
        Logger.log(`✅ Category created: ${name}`);
      }
    }
  }
}
