import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddFtsVectorToInventoryItems1770059281459 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
