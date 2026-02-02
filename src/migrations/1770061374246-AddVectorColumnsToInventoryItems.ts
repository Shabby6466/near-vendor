import { MigrationInterface, QueryRunner } from "typeorm";

// Define the dimension for the embedding vectors. 384 is a common size for efficient models.
const VECTOR_DIMENSION = 384;

export class AddVectorColumnsToInventoryItems1770061374246 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Enable the pgvector extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

        // Step 2: Add the vector columns for text and image embeddings
        await queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "description_vector" vector(${VECTOR_DIMENSION})
        `);

        await queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD COLUMN "image_vector" vector(${VECTOR_DIMENSION})
        `);

        // Step 3: Create HNSW indexes on the vector columns for fast similarity search
        // HNSW is a modern, high-performance index for vector data.
        // The cosine operator (<=>) is a common and effective distance metric.
        await queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_description_vector"
            ON "inventory_items"
            USING HNSW ("description_vector" vector_cosine_ops)
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_inventory_items_image_vector"
            ON "inventory_items"
            USING HNSW ("image_vector" vector_cosine_ops)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes in reverse order
        await queryRunner.query(`DROP INDEX "IDX_inventory_items_image_vector"`);
        await queryRunner.query(`DROP INDEX "IDX_inventory_items_description_vector"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "image_vector"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "description_vector"`);
        // Note: We don't drop the extension in 'down' as it could be used by other tables.
    }

}
