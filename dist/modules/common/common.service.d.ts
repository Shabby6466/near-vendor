import { TimeSpan } from "../../utils/enum";
export declare class CommonService {
    constructor();
    calculateDateRange(timeSpan: TimeSpan): {
        startDate: any;
        endDate: any;
    };
    calculatePercentageChange(newPrice: number, oldPrice: number): number | "100" | "0";
    calculateChange(newPrice: number, oldPrice: number): number;
    generateQR(link: string): Promise<string>;
    calculateCurrentDateRange(timeSpan: TimeSpan): {
        startDate: any;
        endDate: any;
    };
    calculateLast7Days(): {
        startDate: string;
        endDate: string;
    };
    calculateCurrentMonth(): {
        startDate: string;
        endDate: string;
    };
    calculateCurrentYear(): {
        startDate: string;
        endDate: string;
    };
    calculateQuarterly(): {
        startDate: string;
        endDate: string;
    };
}
