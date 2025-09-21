/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 23:11:29
 * @Description: cache.module
 */
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const redisConfig = config.get('redis');
        const client = createClient({
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
          database: redisConfig.db,
          password: redisConfig.password,
        });
        await client.connect();
        return client;
      },
    },
  ],
  controllers: [CacheController],
  exports: [CacheService],
})
export class CacheModule {}
