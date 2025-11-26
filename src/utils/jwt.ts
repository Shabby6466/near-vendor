import { UnauthorizedException } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { randomUUID } from 'crypto';
import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken';

export class AuthToken {
  /**
   * Generate a jwt authentication token
   */
  static generate(payload: JwtPayload | Buffer, options?: SignOptions) {
    return sign(payload, process.env.JWT_SECRET_KEY, {
      jwtid: randomUUID(),
      algorithm: 'HS256',
      ...options,
    });
  }

  /**
   * Verify a JWT token
   */
  static verify(token: string) {
    if (!isJWT(token))
      throw new UnauthorizedException('Unathenticated', {
        cause: new Error('Authentication Required'),
      });
    return verify(token, process.env.JWT_SECRET_KEY);
  }
}
