import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as http from 'http';
import { AppService } from '../src/modules/main/app.service';
import Redis from 'ioredis';

export abstract class Helper {
  protected app: INestApplication;
  protected token: string;
  protected dataSource: DataSource;
  protected redisClient: Redis;

  constructor(app: INestApplication) {
    this.app = app;
    this.dataSource = new DataSource(AppService.typeormConfig());
    this.redisClient = new Redis();
  }

  /**
   * Get Jwt Token of User
   * @returns JwtToken
   */
  public getAccessToken() {
    return `Bearer ${this.token}`;
  }

  /**
   * clear `test` database
   */
  public async clearDB() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    await this.dataSource.dropDatabase();
    await this.dataSource.destroy();
  }

  public async clearRedis() {
    // Flush all the data in the Redis database
    await this.redisClient.flushdb();
    console.log('Redis database cleared.');
  }

  /**
   * clear `test` database
   */
  public async afterAll() {
    await this.clearDB();
    await this.clearRedis();
    await this.app.close();
  }

  public async stopMockServer(server: http.Server) {
    return new Promise<void>((resolve, reject) => {
      server.close((err: Error | undefined) => {
        if (!err) {
          return resolve();
        }
        return reject();
      });
    });
  }
}
