import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class ImageCacheService {
  private client: Redis | null = null;

  private getClient() {
    if (this.client) return this.client;
    const host = process.env.REDIS_HOST;
    const port = Number(process.env.REDIS_PORT || 6379);
    if (!host) return null;

    this.client = new Redis({
      host,
      port,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    return this.client;
  }

  async get(key: string) {
    const c = this.getClient();
    if (!c) return null;
    try {
      await c.connect();
    } catch {
      // ignore
    }
    try {
      return await c.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds = 60 * 60 * 24) {
    const c = this.getClient();
    if (!c) return;
    try {
      await c.connect();
    } catch {
      // ignore
    }
    try {
      await c.set(key, value, "EX", ttlSeconds);
    } catch {
      // ignore
    }
  }
}
