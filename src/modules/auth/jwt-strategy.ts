import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { InvalidTokenException, UserInactiveException, UserSuspendedException } from './auth.exception';
import { UserStatus } from '@utils/enum';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly authService: AuthService,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'fallback_secret_change_me',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, { iat, exp, uuid }, done) {
        const token = req?.headers?.authorization?.split(" ")?.[1] || "";
        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new InvalidTokenException();
        }

        const user: any = await this.authService.getUser(uuid as string);
        if (!user || !token.length) {
            throw new InvalidTokenException();
        }

        // Check user status during token validation
        if (user.status === UserStatus.INACTIVE) {
            throw new UserInactiveException();
        }

        if (user.status === UserStatus.SUSPENDED) {
            throw new UserSuspendedException();
        }

        done(null, user);
    }
}
