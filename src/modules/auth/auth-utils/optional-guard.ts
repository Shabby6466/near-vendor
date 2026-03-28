import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'models/entities/users.entity';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = User>(
        err: Error | null,
        user: TUser | null,
        _info: unknown,
        _context: ExecutionContext,
    ): TUser | null {
        if (err || !user) {
            return null;
        }
        return user;
    }
}
