import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationColumnAndIndexToShops1770058065323 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add the new geography column to store points
        await queryRunner.query(`
            ALTER TABLE "shops"
            ADD COLUMN "location" geography(Point, 4326)
        `);

        // Step 2: Populate the new location column from the existing latitude and longitude columns
        // This query ensures that null latitudes/longitudes don't cause an error
        await queryRunner.query(`
            UPDATE "shops"
            SET "location" = ST_SetSRID(ST_MakePoint("shopLongitude", "shopLatitude"), 4326)
            WHERE "shopLongitude" IS NOT NULL AND "shopLatitude" IS NOT NULL
        `);

        // Step 3: Create a GiST index on the new geography column for fast geospatial queries
        await queryRunner.query(`
            CREATE INDEX "IDX_shops_location" ON "shops" USING GIST ("location")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes in the reverse order
        await queryRunner.query(`
            DROP INDEX "IDX_shops_location"
        `);
        await queryRunner.query(`
            ALTER TABLE "shops"
            DROP COLUMN "location"
        `);
    }

}
