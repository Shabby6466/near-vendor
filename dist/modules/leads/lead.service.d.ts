import { Repository } from "typeorm";
import { Lead } from "../../models/entities/leads.entity";
import { CreateLeadDto } from "./dto/lead.dto";
export declare class LeadService {
    private readonly leadRepo;
    constructor(leadRepo: Repository<Lead>);
    create(dto: CreateLeadDto): Promise<void>;
}
