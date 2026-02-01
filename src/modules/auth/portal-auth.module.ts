import { Module } from "@nestjs/common";
import { UsersModule } from "@modules/users/users.module";
import { PortalAuthController } from "./portal-auth.controller";

@Module({
  imports: [UsersModule],
  controllers: [PortalAuthController],
})
export class PortalAuthModule {}
