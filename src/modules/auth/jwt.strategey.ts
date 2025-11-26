import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { UserService } from "@modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { iat, exp, uuid }, done) {
    const token = req?.headers?.authorization?.split(" ")?.[1] || "";
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user: any = await this.usersService.get(uuid as string);
    if (!user || !token.length) {
      throw new UnauthorizedException();
    }

    done(null, user);
  }
}
