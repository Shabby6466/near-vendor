export declare class Hash {
    static make(plainText: string): Promise<string>;
    static compare(plainText: string, hash: string): Promise<boolean>;
}
