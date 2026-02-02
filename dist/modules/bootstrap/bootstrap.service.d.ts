import { OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../models/entities/users.entity";
export declare class BootstrapService implements OnModuleInit {
    private readonly users;
    private readonly logger;
    constructor(users: Repository<User>);
    onModuleInit(): Promise<void>;
    private ensureSuperAdminWithRetry;
}
