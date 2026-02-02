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
exports.AddLocationColumnAndIndexToShops1770058065323 = void 0;
class AddLocationColumnAndIndexToShops1770058065323 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "shops"
            ADD COLUMN "location" geography(Point, 4326)
        `);
            yield queryRunner.query(`
            UPDATE "shops"
            SET "location" = ST_SetSRID(ST_MakePoint("shopLongitude", "shopLatitude"), 4326)
            WHERE "shopLongitude" IS NOT NULL AND "shopLatitude" IS NOT NULL
        `);
            yield queryRunner.query(`
            CREATE INDEX "IDX_shops_location" ON "shops" USING GIST ("location")
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP INDEX "IDX_shops_location"
        `);
            yield queryRunner.query(`
            ALTER TABLE "shops"
            DROP COLUMN "location"
        `);
        });
    }
}
exports.AddLocationColumnAndIndexToShops1770058065323 = AddLocationColumnAndIndexToShops1770058065323;
//# sourceMappingURL=1770058065323-AddLocationColumnAndIndexToShops.js.map