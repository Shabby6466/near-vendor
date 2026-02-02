/// <reference types="node" />
export declare class GeminiVisionService {
    private model;
    private endpoint;
    sha256(buf: Buffer): string;
    describeImage(image: Buffer, mimeType: string, hintText?: string): Promise<string>;
}
