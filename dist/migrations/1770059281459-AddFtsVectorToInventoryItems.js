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
exports.AddFtsVectorToInventoryItems1770059281459 = void 0;
class AddFtsVectorToInventoryItems1770059281459 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "document_vector" tsvector
        `);
            yield queryRunner.query(`
            UPDATE "inventory_items"
            SET "document_vector" = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
        `);
            yield queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_document_vector"
            ON "inventory_items"
            USING GIN ("document_vector")
        `);
            yield queryRunner.query(`
            CREATE OR REPLACE FUNCTION inventory_items_vector_update() RETURNS trigger AS $$
            BEGIN
                NEW.document_vector := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        `);
            yield queryRunner.query(`
            CREATE TRIGGER tsvectorupdate
            BEFORE INSERT OR UPDATE ON "inventory_items"
            FOR EACH ROW EXECUTE PROCEDURE inventory_items_vector_update();
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP TRIGGER tsvectorupdate ON "inventory_items"
        `);
            yield queryRunner.query(`
            DROP FUNCTION inventory_items_vector_update()
        `);
            yield queryRunner.query(`
            DROP INDEX "IDX_inventory_items_document_vector"
        `);
            yield queryRunner.query(`
            ALTER TABLE "inventory_items"
            DROP COLUMN "document_vector"
        `);
        });
    }
}
exports.AddFtsVectorToInventoryItems1770059281459 = AddFtsVectorToInventoryItems1770059281459;
//# sourceMappingURL=1770059281459-AddFtsVectorToInventoryItems.js.map