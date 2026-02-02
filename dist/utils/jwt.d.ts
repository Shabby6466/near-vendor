/// <reference types="node" />
import { SignOptions, JwtPayload } from 'jsonwebtoken';
export declare class AuthToken {
    static generate(payload: JwtPayload | Buffer, options?: SignOptions): string;
    static verify(token: string): string | JwtPayload;
}
