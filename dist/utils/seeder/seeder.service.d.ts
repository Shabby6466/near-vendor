import { DataSource } from "typeorm";
import { LoggerService } from "../logger/logger.service";
export declare class SeedService {
    private readonly logger;
    private readonly dataSource;
    constructor(logger: LoggerService, dataSource: DataSource);
    seedData(): Promise<void>;
}
