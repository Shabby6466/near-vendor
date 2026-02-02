import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "models/entities/users.entity";
import { BootstrapService } from "./bootstrap.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [BootstrapService],
})
export class BootstrapModule {}
