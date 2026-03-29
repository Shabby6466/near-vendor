import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryIdToWishlists1774745030433 implements MigrationInterface {
    name = 'AddCategoryIdToWishlists1774745030433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" ADD "categoryId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "categoryId"`);
    }
}
