import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "models/entities/users.entity";
import { UserRoles } from "@utils/enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onModuleInit() {
    const phone = process.env.SUPERADMIN_PHONE;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!phone || !password) {
      this.logger.warn("SUPERADMIN_PHONE/SUPERADMIN_PASSWORD not set; skipping superadmin bootstrap");
      return;
    }

    const existing = await this.users.findOne({ where: { phoneNumber: phone } });
    if (existing) {
      if (existing.role !== UserRoles.SUPERADMIN) {
        existing.role = UserRoles.SUPERADMIN;
        existing.isActive = true;
        await this.users.save(existing);
        this.logger.log(`Promoted existing user ${phone} to SUPERADMIN`);
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
  }
}
