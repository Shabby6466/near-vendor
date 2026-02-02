"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
class DateTime {
    static toUTC(dateString, timezone) {
        if (!DateTime.isValidTimezone(timezone)) {
            throw new Error(`Invalid timezone: ${timezone}`);
        }
        if (dateString.endsWith('Z')) {
            dateString = dateString.slice(0, -1);
        }
        const date = new Date(dateString);
        const timezoneOffset = DateTime.getTimezoneOffset(timezone);
        const utcTime = new Date(date.getTime() - timezoneOffset);
        return utcTime;
    }
    static fromUTC(timezone, date) {
        if (!DateTime.isValidTimezone(timezone)) {
            throw new Error(`Invalid timezone: ${timezone}`);
        }
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: DateTime.timeZoneMap[timezone],
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hourCycle: 'h23',
        });
        const parts = formatter.formatToParts(date).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});
        const { year, month, day, hour, minute, second } = parts;
        const isoFormattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}z`;
        return new Date(isoFormattedDate);
    }
    static now(timezone) {
        if (!DateTime.isValidTimezone(timezone)) {
            throw new Error(`Invalid timezone: ${timezone}`);
        }
        const currentDate = new Date();
        return DateTime.fromUTC(timezone, currentDate);
    }
    static new() {
        return new Date();
    }
    static toStandardTimeZone(timezone) {
        return this.timeZoneMap[timezone.toUpperCase()];
    }
    static isValidTimezone(timezone) {
        return timezone.toUpperCase() in DateTime.timeZoneMap;
    }
    static isValidDateFormat(dateString) {
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        return iso8601Regex.test(dateString);
    }
    static getTimezoneOffset(timezone) {
        if (!DateTime.isValidTimezone(timezone)) {
            throw new Error(`Invalid timezone: ${timezone}`);
        }
        const now = new Date();
        const timezoneOffset = now.toLocaleString('en-US', {
            timeZone: DateTime.timeZoneMap[timezone],
        });
        return Date.parse(timezoneOffset) - now.getTime();
    }
}
exports.DateTime = DateTime;
DateTime.timeZoneMap = {
    PKT: 'Asia/Karachi',
    KST: 'Asia/Seoul',
    UTC: 'UTC',
};
DateTime.compareDates = (date1, date2) => {
    const truncateToSecond = (dateStr) => {
        const date = new Date(dateStr);
        return new Date(Math.floor(date.getTime() / 1000) * 1000);
    };
    return truncateToSecond(date1).getTime() === truncateToSecond(date2).getTime();
};
//# sourceMappingURL=date.js.map