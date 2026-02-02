import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddVectorColumnsToInventoryItems1770061374246 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
