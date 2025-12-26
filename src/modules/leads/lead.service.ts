import { Injectable, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lead } from "models/entities/leads.entity";
import { CreateLeadDto } from "./dto/lead.dto";
import { JwtAuthGuard } from "@modules/auth/jwt-guard";
import { ApiBearerAuth } from "@nestjs/swagger";


@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeadService {
    constructor(
        @InjectRepository(Lead)
        private readonly leadRepo: Repository<Lead>
    ) { }

    async create(dto: CreateLeadDto) {
        const lead = new Lead();
        lead.status = dto.status;
        lead.saleValue = dto.saleValue;

    }


}