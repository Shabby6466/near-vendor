import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthToken } from '@utils/jwt';
import { ResponseMessage, UserRoles } from '@utils/enum';
import { ROLES_KEY } from '@modules/common/decorator/role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
            const request: Request = context.switchToHttp().getRequest();
            request.headers.authorization = request.headers.authorization?.replace('Bearer', '').replace(/\s/g, '');
            const token: string = request.headers.authorization;

            if (!token) { throw new UnauthorizedException('Unauthenticated', { cause: null }); }
            const payload = AuthToken.verify(token);
            if (typeof payload === 'object') {
                if (requiredRoles?.length && !requiredRoles.includes(payload.user.role)) {
                    throw new ForbiddenException(ResponseMessage.FORBIDDEN_ACCESS);
                }
                request['user'] = payload.user;
                return true;
            }
        } catch (error: any) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Unauthenticated', {
                    cause: new Error('Expired Token'),
                    description: 'Expire token provided',
                });
            }
            throw error;
        }
    }
}
