import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrigramIndexesToItems1774722365903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Enable the pg_trgm extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);

        // Step 2: Create GIN indexes for trigram-based fuzzy search
        // For 'name' column
        await queryRunner.query(`
            CREATE INDEX "idx_items_name_trgm" 
            ON "items" 
            USING gin (name gin_trgm_ops)
        `);

        // For 'description' column
        await queryRunner.query(`
            CREATE INDEX "idx_items_description_trgm" 
            ON "items" 
            USING gin (description gin_trgm_ops)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Drop the indexes
        await queryRunner.query(`DROP INDEX "idx_items_description_trgm"`);
        await queryRunner.query(`DROP INDEX "idx_items_name_trgm"`);
        
        // Note: We don't drop the extension in 'down' as it could be used by other features.
    }

}
