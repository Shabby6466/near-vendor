import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "models/entities/users.entity";
import { UserRoles } from "@utils/enum";
import * as bcrypt from "bcryptjs";

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onModuleInit() {
    // Run in background with retries so we don't crash startup if DB schema isn't ready yet.
    void this.ensureSuperAdminWithRetry();
  }

  private async ensureSuperAdminWithRetry() {
    const phone = process.env.SUPERADMIN_PHONE;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!phone || !password) {
      this.logger.warn("SUPERADMIN_PHONE/SUPERADMIN_PASSWORD not set; skipping superadmin bootstrap");
      return;
    }

    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        const existing = await this.users.findOne({ where: { phoneNumber: phone } });
        if (existing) {
          if (existing.role !== UserRoles.SUPERADMIN) {
            existing.role = UserRoles.SUPERADMIN;
            existing.isActive = true;
            await this.users.save(existing);
            this.logger.log(`Promoted existing user ${phone} to SUPERADMIN`);
          } else {
            this.logger.log(`SUPERADMIN already present for ${phone}`);
          }
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.users.create({
          fullName: "Super Admin",
          phoneNumber: phone,
          password: hashedPassword,
          role: UserRoles.SUPERADMIN,
          mustChangePassword: false,
          isActive: true,
          lastKnownLatitude: null as any,
          lastKnownLongitude: null as any,
        } as any);

        await this.users.save(user);
        this.logger.log(`Created SUPERADMIN user for ${phone}`);
        return;
      } catch (err) {
        this.logger.error(`Superadmin bootstrap attempt ${attempt}/10 failed`, err as any);
        // wait before retry
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    this.logger.error("Superadmin bootstrap failed after 10 attempts");
  }
}
