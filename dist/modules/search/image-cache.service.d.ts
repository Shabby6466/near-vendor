export declare class ImageCacheService {
    private client;
    private getClient;
    get(key: string): Promise<string>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}
