// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { User } from '@modules/user/entities/user.entity';

// @Injectable()
// export class OptionalAuthGuard extends AuthGuard('jwt') {
//     handleRequest<TUser = User>(
//         err: Error | null,
//         user: TUser | null,
//         _info: unknown,
//         _context: ExecutionContext,
//     ): TUser | null {
//         // If token is invalid or expired, do not throw an error, just proceed as unauthenticated
//         if (err || !user) {
//             return null;
//         }
//         return user;
//     }
// }
