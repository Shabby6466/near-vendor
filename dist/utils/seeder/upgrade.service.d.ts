import { DataSource } from "typeorm";
export declare class UpgradeService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    runUpgrade(): Promise<void>;
}
