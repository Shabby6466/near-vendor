import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFtsVectorToInventoryItems1770059281459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add the tsvector column to the inventory_items table
        await queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "document_vector" tsvector
        `);

        // Step 2: Update existing rows to populate the new vector column
        await queryRunner.query(`
            UPDATE "inventory_items"
            SET "document_vector" = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
        `);

        // Step 3: Create a GIN index on the tsvector column for fast full-text search
        await queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_document_vector"
            ON "inventory_items"
            USING GIN ("document_vector")
        `);

        // Step 4: Create a function and a trigger to automatically update the vector on insert or update
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION inventory_items_vector_update() RETURNS trigger AS $$
            BEGIN
                NEW.document_vector := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER tsvectorupdate
            BEFORE INSERT OR UPDATE ON "inventory_items"
            FOR EACH ROW EXECUTE PROCEDURE inventory_items_vector_update();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes in reverse order
        await queryRunner.query(`
            DROP TRIGGER tsvectorupdate ON "inventory_items"
        `);
        await queryRunner.query(`
            DROP FUNCTION inventory_items_vector_update()
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_inventory_items_document_vector"
        `);
        await queryRunner.query(`
            ALTER TABLE "inventory_items"
            DROP COLUMN "document_vector"
        `);
    }

}
