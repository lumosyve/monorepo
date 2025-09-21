/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 23:11:29
 * @Description: cache.service
 */
import { Inject, Injectable } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

import { RedisClientType } from 'redis';
import { log2term } from 'src/utils';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}

  async get(key: string): Promise<any> {
    let value = await this.redisClient.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    return value;
  }

  /**
   * 设置值
   * @param key {string} key
   * @param value 值
   * @param second 过期时间 秒
   * @returns Promise<any>
   */
  async set(key: string, value: any, second?: number) {
    log2term('redis set key', key, 'value ', value, 'second', second);
    value = JSON.stringify(value);
    let options = {};
    if (second) {
      options = { EX: second };
    }
    console.log('options', options);
    return await this.redisClient.set(key, value, options);
  }
  //删除值
  async del(key: string) {
    log2term('redis del key', key);
    return await this.redisClient.del(key);
  }
  //清除缓存
  async flushall() {
    log2term('redis flushAll');
    return await this.redisClient.flushAll();
  }
  // 获取匹配key的数据
  async getKeys(key: string) {
    const keys = await this.redisClient.keys(key);
    return keys;
  }
  // 更新过期时间
  async updateExpire(key: string, second: number) {
    return await this.redisClient.expire(key, second);
  }
}
