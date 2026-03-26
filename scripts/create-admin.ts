import { DataSource } from 'typeorm';
import { User } from '../src/models/entities/users.entity';
import { UserRoles } from '../src/utils/enum/index';
import { Shops } from '../src/models/entities/shops.entity';
import { Vendors } from '../src/models/entities/vendors.entity';
import { Category } from '../src/models/entities/categories.entity';
import { InventoryItem } from '../src/models/entities/inventory-item.entity';
import { Item } from '../src/models/entities/items.entity';
import { VendorApplication } from '../src/models/entities/vendor-applications.entity';
import { OtpRecord } from '../src/models/entities/otp.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

async function createAdmin() {
  const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@nearvendor.com';
  const adminPassword = process.env.SUPERADMIN_PASSWORD || 'pswd123';

  console.log(`Connecting to database ${process.env.DB_DATABASE} on ${process.env.DB_HOST}...`);

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Shops, Vendors, Category, InventoryItem, Item, VendorApplication, OtpRecord],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    await AppDataSource.initialize();
    console.log('Database connected.');

    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { email: adminEmail } });

    if (existing) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = userRepo.create({
      fullName: 'Super Admin',
      email: adminEmail,
      password: hashed,
      role: UserRoles.SUPERADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    await userRepo.save(admin);
    console.log(`✅ Super admin created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdmin();
