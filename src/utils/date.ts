export class DateTime {
  public static timeZoneMap = {
    PKT: 'Asia/Karachi',
    KST: 'Asia/Seoul',
    UTC: 'UTC',
  } as const;

  /**
   * Converts the provided `dateString` from a specific `timezone` to UTC.
   * @param {string} dateString - The date string to convert to UTC (format: 'YYYY-MM-DDTHH:mm:ss').
   * @param {keyof typeof DateTime.timeZoneMap} timezone - The timezone identifier (e.g., 'PKT', 'KST').
   * @returns {Date} - The UTC time as a Date object.
   * @throws {Error} - If the `dateString` format is invalid or `timezone` is invalid.
   */
  static toUTC(dateString: string, timezone: keyof typeof DateTime.timeZoneMap): Date {
    if (!DateTime.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Remove 'Z' suffix if present
    if (dateString.endsWith('Z')) {
      dateString = dateString.slice(0, -1);
    }

    const date = new Date(dateString);
    const timezoneOffset = DateTime.getTimezoneOffset(timezone);
    const utcTime = new Date(date.getTime() - timezoneOffset);
    return utcTime;
  }

  /**
   * Converts the provided UTC `date` to a specific `timezone`.
   * @param {keyof typeof DateTime.timeZoneMap} timezone - The timezone identifier (e.g., 'PKT', 'KST').
   * @param {Date} date - The date object to convert.
   * @returns {Date} - The converted date in the specified timezone.
   * @throws {Error} - If `timezone` is invalid.
   */
  static fromUTC(timezone: string, date: Date): Date {
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
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
      return acc;
    }, {} as any);
    const { year, month, day, hour, minute, second } = parts;
    const isoFormattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}z`;
    return new Date(isoFormattedDate);
  }

  /**
   * Returns the current date/time in a specific `timezone`.
   * @param {keyof typeof DateTime.timeZoneMap} timezone - The timezone identifier (e.g., 'PKT', 'KST').
   * @returns {Date} - The current date/time in the specified timezone.
   * @throws {Error} - If `timezone` is invalid.
   */
  static now(timezone: string): Date {
    if (!DateTime.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    const currentDate = new Date();
    return DateTime.fromUTC(timezone, currentDate);
  }

  /**
   * Returns the current date/time in a specific `timezone`.
   * @param {keyof typeof DateTime.timeZoneMap} timezone - The timezone identifier (e.g., 'PKT', 'KST').
   * @returns {Date} - The current date/time in the specified timezone.
   * @throws {Error} - If `timezone` is invalid.
   */
  static new(): Date {
    return new Date();
  }

  /**
   * Returns the standard time zone.
   * @returns timeZoneMap - timezone.
   */
  static toStandardTimeZone(timezone: string): string {
    return this.timeZoneMap[timezone.toUpperCase()] as string;
  }

  static compareDates = (date1: string, date2: string) => {
    const truncateToSecond = (dateStr: string) => {
      const date = new Date(dateStr);
      return new Date(Math.floor(date.getTime() / 1000) * 1000);
    };
    return truncateToSecond(date1).getTime() === truncateToSecond(date2).getTime();
  };

  /**
   * Validates if the provided `timezone` is a valid timezone identifier.
   * @param {string} timezone - The timezone identifier to validate.
   * @returns {boolean} - True if `timezone` is valid; false otherwise.
   */
  private static isValidTimezone(timezone: string): boolean {
    return timezone.toUpperCase() in DateTime.timeZoneMap;
  }

  /**
   * Validates if the provided `dateString` is in a valid format ('YYYY-MM-DDTHH:mm:ss').
   * @param {string} dateString - The date string to validate.
   * @returns {boolean} - True if `dateString` is in a valid format; false otherwise.
   */
  private static isValidDateFormat(dateString: string): boolean {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return iso8601Regex.test(dateString);
  }

  /**
   * Returns the offset in milliseconds from UTC for the specified `timezone`.
   * @param {keyof typeof DateTime.timeZoneMap} timezone - The timezone identifier (e.g., 'PKT', 'KST').
   * @returns {number} - The offset in milliseconds from UTC.
   * @throws {Error} - If `timezone` is invalid.
   */
  private static getTimezoneOffset(timezone: keyof typeof DateTime.timeZoneMap): number {
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
