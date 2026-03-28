import { CommonModule } from "@modules/common/common.module";
import { MediaModule } from "@modules/media/media.module";
import { BullModule } from "@nestjs/bull";
import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "@utils/logger/logger.middleware";
import { LoggerModule } from "@utils/logger/logger.module";
import { SeedModule } from "@utils/seeder/seeder.module";
import { RateLimiter } from "bull";
import { WinstonModule } from "nest-winston";
import { AppService } from "./app.service";
import { ProcessorModule } from "@modules/processor/processor.module";
import { ItemModule } from "@modules/items/item.module";
import { UsersModule } from "@modules/users/users.module";
import { SearchModule } from "@modules/search/search.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "@modules/auth/auth.module";
import { VendorModule } from "@modules/vendor/vendor.module";
import { ShopModule } from "@modules/shop/shop.module";
import { CategoriesModule } from "@modules/categories/categories.module";
import { ExploreModule } from "@modules/explore/explore.module";
import { AnalyticsModule } from "@modules/analytics/analytics.module";
import { AIModule } from "@modules/ai/ai.module";
import { AdminModule } from "@modules/admin/admin.module";

export const adminModulesImports: ModuleMetadata["imports"] = [
  AdminModule,
];

export const imports: ModuleMetadata["imports"] = [
  ConfigModule.forRoot({ envFilePath: [AppService.envConfiguration()], ignoreEnvFile: false }),
  ThrottlerModule.forRoot([
    {
      ttl: 60_000,
      limit: 120,
    },
  ]),
  TypeOrmModule.forRootAsync({
    useFactory: () => AppService.typeormConfig(),
  }),
  WinstonModule.forRootAsync({
    useFactory: () => AppService.createWinstonTransports(),
  }),
  BullModule.forRootAsync({
    useFactory: () => ({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || process.env.BULL_REDIS_DB || '0', 10),
      },
      limiter: {
        max: 1000,
        duration: 5000,
        bounceBack: false,
      } as RateLimiter,
    }),
  }),
  LoggerModule,
  CommonModule,
  MulterModule.register({
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  }),
  SeedModule,
  MediaModule,
  ProcessorModule,
  AuthModule,
  UsersModule,
  VendorModule,
  ShopModule,
  ItemModule,
  SearchModule,
  CategoriesModule,
  ExploreModule,
  AnalyticsModule,
  AIModule,
];

@Module({
  imports: [...imports, ...adminModulesImports, ScheduleModule.forRoot()],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
