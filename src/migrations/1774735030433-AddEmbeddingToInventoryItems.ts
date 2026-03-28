import { MigrationInterface, QueryRunner } from "typeorm"

export class AddEmbeddingToInventoryItems1774735030433 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Ensure pgvector extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

        // Step 2: Add the embedding column of type vector(384)
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD COLUMN "embedding" vector(384)
        `);

        // Step 3: Create HNSW index for high-speed vector lookups
        await queryRunner.query(`
            CREATE INDEX idx_items_embedding 
            ON "items" 
            USING hnsw (embedding vector_cosine_ops)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_items_embedding"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "embedding"`);
    }

}
