import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import process from "process";

@Injectable()
export class UpgradeService {
  constructor(private readonly dataSource: DataSource) {
    if (process.env.UPGRADE_DB === "true") {
      void this.runUpgrade();
    }
  }

  async runUpgrade() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
