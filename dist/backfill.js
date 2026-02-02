"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/main/app.module");
const inventory_service_1 = require("./modules/inventory/inventory.service");
const common_1 = require("@nestjs/common");
const inventory_item_entity_1 = require("./models/entities/inventory-item.entity");
const typeorm_1 = require("@nestjs/typeorm");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new common_1.Logger('BackfillScript');
        logger.log('--- Starting backfill script for embeddings ---');
        const app = yield core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const inventoryItemRepository = app.get((0, typeorm_1.getRepositoryToken)(inventory_item_entity_1.InventoryItem));
        const inventoryService = app.get(inventory_service_1.InventoryService);
        const embeddingQueue = inventoryService.embeddingQueue;
        if (!embeddingQueue) {
            logger.error('Could not get embedding queue. Aborting.');
            yield app.close();
            return;
        }
        logger.log('Fetching all inventory items from the database...');
        const allItems = yield inventoryItemRepository.find({ select: ['id'] });
        const totalItems = allItems.length;
        logger.log(`Found ${totalItems} items to process.`);
        let count = 0;
        for (const item of allItems) {
            yield embeddingQueue.add('generate-embedding', { itemId: item.id }, {
                jobId: `backfill-${item.id}`,
                attempts: 3,
                removeOnComplete: true,
            });
            count++;
            if (count % 100 === 0) {
                logger.log(`Queued ${count} of ${totalItems} items...`);
            }
        }
        logger.log(`--- Successfully queued all ${totalItems} items for embedding generation ---`);
        yield app.close();
    });
}
bootstrap();
//# sourceMappingURL=backfill.js.map