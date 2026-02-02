export declare class DateTime {
    static timeZoneMap: {
        readonly PKT: "Asia/Karachi";
        readonly KST: "Asia/Seoul";
        readonly UTC: "UTC";
    };
    static toUTC(dateString: string, timezone: keyof typeof DateTime.timeZoneMap): Date;
    static fromUTC(timezone: string, date: Date): Date;
    static now(timezone: string): Date;
    static new(): Date;
    static toStandardTimeZone(timezone: string): string;
    static compareDates: (date1: string, date2: string) => boolean;
    private static isValidTimezone;
    private static isValidDateFormat;
    private static getTimezoneOffset;
}
