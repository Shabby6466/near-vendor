import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "@utils/enum";

export const Roles = (...roles: UserRoles[]) => SetMetadata("roles", roles);
