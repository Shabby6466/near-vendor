import { Cache } from 'cache-manager';
import { EXPIRES, PREFIXES } from './commons/cache-manager.enums';
import { Queue } from 'bull';
export declare class CacheManagerService {
    private cacheManager;
    private readonly defaultQueue;
    constructor(cacheManager: Cache, defaultQueue: Queue);
    get(key: string): Promise<string | undefined>;
    getTyped<T>(key: string): Promise<T | undefined>;
    del(key: string): Promise<any>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    setTyped<T>(key: string, value: T, ttl?: number): Promise<void>;
    setToken(email: string, token: string, prefix: PREFIXES): Promise<void>;
    getToken(email: string, prefix: PREFIXES | string): Promise<string>;
    getCreationTime(email: string, prefix: PREFIXES | string): Promise<number | null>;
    delToken(email: string, prefix: PREFIXES | string): Promise<void>;
    getOTP(email: string): Promise<string>;
    setOTP(email: string, ttl?: EXPIRES): Promise<string>;
    delOTP(email: string): Promise<string>;
}
