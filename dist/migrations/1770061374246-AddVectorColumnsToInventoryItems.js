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
exports.AddVectorColumnsToInventoryItems1770061374246 = void 0;
const VECTOR_DIMENSION = 384;
class AddVectorColumnsToInventoryItems1770061374246 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
            yield queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "description_vector" vector(${VECTOR_DIMENSION})
        `);
            yield queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "image_vector" vector(${VECTOR_DIMENSION})
        `);
            yield queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_description_vector"
            ON "inventory_items"
            USING HNSW ("description_vector" vector_cosine_ops)
        `);
            yield queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_image_vector"
            ON "inventory_items"
            USING HNSW ("image_vector" vector_cosine_ops)
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_inventory_items_image_vector"`);
            yield queryRunner.query(`DROP INDEX "IDX_inventory_items_description_vector"`);
            yield queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "image_vector"`);
            yield queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "description_vector"`);
        });
    }
}
exports.AddVectorColumnsToInventoryItems1770061374246 = AddVectorColumnsToInventoryItems1770061374246;
//# sourceMappingURL=1770061374246-AddVectorColumnsToInventoryItems.js.map