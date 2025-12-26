import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "@utils/enum";
import { InsufficientRoleException } from "./auth.exception";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
            "roles",
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const allowed = requiredRoles.some((role) => user.role === role);
        if (!allowed) {
            throw new InsufficientRoleException();
        }
        return true;
    }
}
