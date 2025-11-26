import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EXPIRES, PREFIXES, QueueName } from './commons/cache-manager.enums';
import { generateOTP } from '@utils/helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue(QueueName.DEFAULT)
    private readonly defaultQueue: Queue,
  ) {}

  /**
   * Get value by key from cache manager
   *
   * @param key
   * @return value | undefined
   */
  async get(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }

  async getTyped<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get(key);
  }

  /**
   * Delete value by key in cache manager
   *
   * @param key
   * @return
   */
  async del(key: string): Promise<any> {
    await this.cacheManager.del(key);
    await this.cacheManager.del(`${key}_created_at`);
  }

  /**
   * Set key value pair in cache manager
   *
   * @return
   * @param key
   * @param value
   * @param ttl
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    // Store the creation time in a separate Redis key
    const now = new Date().getTime();
    await this.cacheManager.set(`${key}_created_at`, now.toString(), ttl);
    await this.cacheManager.set(key, value, ttl);
    return;
  }

  async setTyped<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Store the creation time in a separate Redis key
    const now = new Date().getTime();
    await this.cacheManager.set(`${key}_created_at`, now.toString(), ttl);
    await this.cacheManager.set(key, value, ttl);
    return;
  }

  /**
   * Set token against an email in cache manager
   *
   * @returns
   * @param email
   * @param token
   * @param prefix
   */
  async setToken(email: string, token: string, prefix: PREFIXES) {
    const enumKey = Object.keys(PREFIXES).find((key) => PREFIXES[key] === prefix);
    const ttl = EXPIRES[enumKey] as number;

    await this.set(`${prefix}${email}`, token, ttl);
  }

  /**
   * Get token against by email from cache manager
   *
   * @returns
   * @param email
   * @param prefix
   */
  async getToken(email: string, prefix: PREFIXES | string): Promise<string> {
    return await this.get(`${prefix}${email}`);
  }

  async getCreationTime(email: string, prefix: PREFIXES | string): Promise<number | null> {
    const key = prefix !== null ? `${prefix}${email}` : `${PREFIXES.OTP}${email}`;
    // Retrieve the creation time from the separate Redis key
    const creationTime = await this.cacheManager.get<number>(`${key}_created_at`);

    return creationTime !== undefined ? creationTime : null;
  }

  /**
   * Delete token against by email from cache manager
   *
   * @returns
   * @param email
   * @param prefix
   */
  async delToken(email: string, prefix: PREFIXES | string) {
    await this.del(`${prefix}${email}`);
  }

  /**
   * Get OTP by email from cache manager
   *
   * @param email
   * @return email
   */
  async getOTP(email: string): Promise<string> {
    return await this.get(`${PREFIXES.OTP}${email}`);
  }

  /**
   * Set OTP against email in cache manager
   *
   * @param email
   * @param ttl time to live
   * @return otp
   */
  async setOTP(email: string, ttl = EXPIRES.OTP): Promise<string> {
    const otp = generateOTP();
    await this.set(`${PREFIXES.OTP}${email}`, otp.toString(), ttl);
    return otp.toString();
  }

  async delOTP(email: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.del(`${PREFIXES.OTP}${email}`);
  }
}
