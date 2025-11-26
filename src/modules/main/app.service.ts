import { Injectable } from '@nestjs/common';
import { NodeEnv } from '@utils/enum';
import { WinstonModuleOptions } from 'nest-winston';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as winston from 'winston';
import Console from 'winston-console-transport';

@Injectable()
export class AppService {
  constructor() {
    // void this.adminAuthService.createSuperAdmin();
  }

  static typeormConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + './../**/**.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNC === 'true',
      extra: {
        // based on  https://node-postgres.com/api/pool
        // max connection pool size
        max: 100,
        connectionLimit: 1000,
      },
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
      subscribers: [],
    };
   
  }

  /**
   * Configures The App Environment
   */
  static envConfiguration(): string {
    switch (process.env.NODE_ENV as NodeEnv) {
      case NodeEnv.TEST:
        return `_${NodeEnv.TEST}.env`;

      default:
        return '.env';
    }
  }

  public static createWinstonTransports() {
    let options: WinstonModuleOptions;
    if ((process.env.NODE_ENV as NodeEnv) === NodeEnv.TEST) {
      options = {
        transports: [
          new Console({
            level: 'debug',
            silent: true,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`),
              winston.format.colorize({
                all: true,
                colors: { warn: 'yellow' },
              }),
            ),
          }),
        ],
      };
    } else {
      options = {
        transports: [
          new Console({
            level: 'debug',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`),
              winston.format.colorize({
                all: true,
                colors: { warn: 'yellow' },
              }),
            ),
          }),
        ],
      };
    }

    return options;
  }

  public static startup() {
    try {
      process
        .on('unhandledRejection', (reason) =>
          // eslint-disable-next-line no-console
          console.error('Unhandled Rejection at Promise', reason),
        )
        .on('uncaughtException', (err) => {
          // eslint-disable-next-line no-console
          console.error(err, 'Uncaught Exception thrown');
          process.exit(1);
        });
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  root(): string {
    return process.env.APP_URL;
  }
}
