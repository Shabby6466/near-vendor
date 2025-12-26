import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lead } from "models/entities/leads.entity";
import { LeadController } from "./lead.controller";
import { LeadService } from "./lead.service";

@Module({
    imports: [TypeOrmModule.forFeature([Lead])],
    controllers: [LeadController],
    providers: [LeadService],
    exports: [LeadService]
})
export class LeadModule { }