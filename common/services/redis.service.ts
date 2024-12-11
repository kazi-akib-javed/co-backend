import { Inject, Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: RedisClient;

  constructor(@Inject('REDIS_SESSION') redisClient: RedisClient) {
    this.client = redisClient;
    this.registerEventHandlers();
  }

  private registerEventHandlers(): void {
    this.client.on('connect', () => console.log('Redis connected.'));
    this.client.on('error', (error: Error) => console.error('Redis error:', error.message));
    this.client.on('end', () => console.log('Redis connection closed.'));
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error getting key "${key}":`, error);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.set(key, value, 'EX', ttl);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
      throw error;
    }
  }

  async expire(key: string, ttl: number): Promise<number> {
    try {
      return await this.client.expire(key, ttl);
    } catch (error) {
      console.error(`Error setting expiration for key "${key}":`, error);
      throw error;
    }
  }
  

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error(`Error checking existence of key "${key}":`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
