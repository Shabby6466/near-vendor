import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheManagerService } from './cache-manager.service';
import * as redisStore from 'cache-manager-ioredis';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './commons/cache-manager.enums';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        };
      },
    }),
    BullModule.registerQueueAsync({
      name: QueueName.DEFAULT,
    }),
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
