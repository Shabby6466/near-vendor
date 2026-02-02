"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.imports = exports.adminModulesImports = void 0;
const common_module_1 = require("../common/common.module");
const media_module_1 = require("../media/media.module");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const logger_middleware_1 = require("../../utils/logger/logger.middleware");
const logger_module_1 = require("../../utils/logger/logger.module");
const seeder_module_1 = require("../../utils/seeder/seeder.module");
const nest_winston_1 = require("nest-winston");
const app_service_1 = require("./app.service");
const processor_module_1 = require("../processor/processor.module");
const shop_module_1 = require("../shop/shop.module");
const item_module_1 = require("../items/item.module");
const lead_module_1 = require("../leads/lead.module");
const users_module_1 = require("../users/users.module");
const inventory_module_1 = require("../inventory/inventory.module");
const search_module_1 = require("../search/search.module");
const vendor_applications_module_1 = require("../vendor-applications/vendor-applications.module");
const admin_module_1 = require("../admin/admin.module");
const throttler_1 = require("@nestjs/throttler");
const bootstrap_module_1 = require("../bootstrap/bootstrap.module");
const vendor_portal_module_1 = require("../vendor-portal/vendor-portal.module");
const portal_auth_module_1 = require("../auth/portal-auth.module");
exports.adminModulesImports = [];
exports.imports = [
    config_1.ConfigModule.forRoot({ envFilePath: [app_service_1.AppService.envConfiguration()], ignoreEnvFile: false }),
    throttler_1.ThrottlerModule.forRoot([
        {
            ttl: 60000,
            limit: 120,
        },
    ]),
    typeorm_1.TypeOrmModule.forRoot(app_service_1.AppService.typeormConfig()),
    nest_winston_1.WinstonModule.forRootAsync({
        useFactory: () => app_service_1.AppService.createWinstonTransports(),
    }),
    bull_1.BullModule.forRoot({
        redis: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            db: Number(process.env.BULL_REDIS_DB),
        },
        limiter: {
            max: 1000,
            duration: 5000,
            bounceBack: false,
        },
    }),
    logger_module_1.LoggerModule,
    common_module_1.CommonModule,
    platform_express_1.MulterModule.register({
        limits: {
            fileSize: 50,
        },
    }),
    seeder_module_1.SeedModule,
    media_module_1.MediaModule,
    processor_module_1.ProcessorModule,
    users_module_1.UsersModule,
    shop_module_1.ShopModule,
    item_module_1.ItemModule,
    lead_module_1.LeadModule,
    inventory_module_1.InventoryModule,
    search_module_1.SearchModule,
    vendor_applications_module_1.VendorApplicationsModule,
    admin_module_1.AdminModule,
    vendor_portal_module_1.VendorPortalModule,
    portal_auth_module_1.PortalAuthModule,
    bootstrap_module_1.BootstrapModule,
];
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes({ path: "*", method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [...exports.imports, ...exports.adminModulesImports, schedule_1.ScheduleModule.forRoot()],
        controllers: [],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map