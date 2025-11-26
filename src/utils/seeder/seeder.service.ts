/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, Logger } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

import { LoggerService } from "@utils/logger/logger.service";

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource
  ) {
    // only main process

    this.seedData()
      .then((data) => Logger.log(data))
      .catch((err) => Logger.error(err));
  }

  async seedData() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "SeederService");
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
