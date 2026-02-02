/// <reference types="multer" />
import { S3 } from 'aws-sdk';
export declare class S3Service {
    constructor();
    static imageFilter(this: void, req: any, file: Express.Multer.File, callback: any): void;
    static fileFilter(this: void, req: any, file: Express.Multer.File, callback: any): void;
    getS3(): S3;
    upload(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData>;
    uploadMultiple(files: Express.Multer.File[]): Promise<S3.ManagedUpload.SendData>[];
    uploadS3(file: any, bucket: string, name: any, mimetype?: any): Promise<S3.ManagedUpload.SendData>;
    uploadS3CSVText(doc: string, mimetype: string, key: string): Promise<S3.ManagedUpload.SendData>;
    getPublicURL(key: string): string;
    getSignedURL(key: any): string;
    getKeys(): Promise<string[]>;
    deleteObject(key: string): Promise<void>;
    getObject(key: string): Promise<import("aws-sdk/lib/request").PromiseResult<S3.GetObjectOutput, import("aws-sdk").AWSError>>;
    getKeyFromUrl(url: string): string;
}
