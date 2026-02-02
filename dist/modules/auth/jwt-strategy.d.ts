import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(req: Request, { iat, exp, uuid }: {
        iat: any;
        exp: any;
        uuid: any;
    }, done: any): Promise<void>;
}
export {};
