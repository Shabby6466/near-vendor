import { Injectable } from "@nestjs/common";
import { EnNumber, TimeSpan } from "@utils/enum";
import * as QRCode from "qrcode";
import Jimp from "jimp";
import { join } from "path";
import {
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  subMonths,
  subYears,
} from "date-fns";

@Injectable()
export class CommonService {
  constructor() {}

  /**
   * Calculates the date range for the previous period based on the provided time span.
   *
   * @param {TimeSpan} timeSpan - The current time span for which the date range is being calculated.
   * @returns {{ startDate: string, endDate: string }} - The calculated start and end dates for the previous period.
   */
  public calculateDateRange(timeSpan: TimeSpan) {
    const now = new Date(); // Current date and time in UTC
    let startDate, endDate;

    switch (timeSpan) {
      case TimeSpan.DAILY:
        // Yesterday's start and end
        startDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          0,
          0,
          0
        );
        endDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          23,
          59,
          59
        );
        break;
      case TimeSpan.WEEKLY:
        // Start of last week (last Monday)
        const lastMonday = new Date(now);
        lastMonday.setUTCDate(now.getUTCDate() - now.getUTCDay() - 6); // Adjust to last Monday
        lastMonday.setUTCHours(0, 0, 0, 0); // Set to start of day

        // End of last week (last Sunday)
        const lastSunday = new Date(lastMonday);
        lastSunday.setUTCDate(lastMonday.getUTCDate() + 6); // Adjust to last Sunday
        lastSunday.setUTCHours(23, 59, 59, 999); // Set to end of day

        startDate = lastMonday;
        endDate = lastSunday;
        break;
      case TimeSpan.MONTHLY:
        // Start of last month
        startDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth() - 1,
          1,
          0,
          0,
          0
        );
        // End of last month
        endDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          0,
          23,
          59,
          59
        ); // 0th day is last day of the previous month
        break;
      case TimeSpan.LAST_QUARTER:
        // Start of the last quarter
        const quarterStartMonth = Math.floor((now.getUTCMonth() - 3) / 3) * 3;
        startDate = new Date(
          now.getUTCFullYear(),
          quarterStartMonth,
          1,
          0,
          0,
          0
        );

        // End of the last quarter
        const quarterEndMonth = quarterStartMonth + 2;
        endDate = new Date(
          now.getUTCFullYear(),
          quarterEndMonth + 1,
          0,
          23,
          59,
          59
        ); // 0th day is last day of the quarter end month
        break;
      case TimeSpan.YEARLY:
        // Start of last year
        startDate = new Date(now.getUTCFullYear() - 1, 0, 1, 0, 0, 0);
        // End of last year
        endDate = new Date(now.getUTCFullYear(), 0, 0, 23, 59, 59); // 0th day is last day of the previous year (Dec 31)
        break;
      case TimeSpan.ALL:
        break;
      default:
        throw new Error("Unsupported timeSpan value");
    }

    // Format to 'YYYY-MM-DDTHH:MM:SSZ' (ISO 8601) for SQL
    startDate = startDate?.toISOString().slice(0, 19).replace("T", " ") + "+00";
    endDate = endDate?.toISOString().slice(0, 19).replace("T", " ") + "+00";

    return { startDate, endDate };
  }

  /**
   * Calculates the percentage change between a new value and an old value.
   *
   * @param {number} newPrice - The current or new value.
   * @param {number} oldPrice - The previous or old value.
   * @returns {string | number} - The percentage change between the new and old values.
   *                              - Returns '100' if the oldPrice is zero and the newPrice is greater than zero,
   *                                representing significant growth from zero.
   *                              - Returns '0' if both oldPrice and newPrice are zero, indicating no change.
   *                              - Otherwise, returns the calculated percentage change as a number.
   */
  public calculatePercentageChange(newPrice: number, oldPrice: number) {
    if (oldPrice === 0) {
      if (newPrice > 0) {
        return "100"; // Representing significant growth from zero
      } else {
        return "0"; // No change if both are zero
      }
    }
    return ((newPrice - oldPrice) / oldPrice) * EnNumber.HUNDRED;
  }

  public calculateChange(newPrice: number, oldPrice: number) {
    return newPrice - oldPrice;
  }

  /**
   * Generates a QR code with a logo overlay.
   *
   * @param link - The URL or text to encode in the QR code.
   * @returns The final QR code image as a base64 string.
   */
  public async generateQR(link: string) {
    // Generate QR code as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(link, {
      errorCorrectionLevel: "H",
      scale: 10,
      margin: 2,
    });

    const logoPath = join("public", "logo.png");

    // Load QR code and logo images
    const [qrImage, logo] = await Promise.all([
      Jimp.read(qrCodeBuffer),
      Jimp.read(logoPath),
    ]);

    qrImage.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]);

    logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO, Jimp.RESIZE_BICUBIC);

    // Center the logo on the QR code
    const x = qrImage.bitmap.width / 2 - logo.bitmap.width / 2;
    const y = qrImage.bitmap.height / 2 - logo.bitmap.height / 2;
    qrImage.composite(logo, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1,
    });

    qrImage.brightness(0.1).contrast(0.1);
    // Convert the final image to a base64 string
    return await qrImage.getBase64Async(Jimp.MIME_PNG);
  }

  /**
   * Calculates the start and end date for the current time span based on the provided timeSpan value.
   * The range is based on UTC time and supports DAILY, WEEKLY, MONTHLY, QUARTER, and YEARLY spans.
   *
   * - DAILY: Returns the current day's start (midnight) and the current time.
   * - WEEKLY: Returns the start of the current week (Monday) and the current time.
   * - MONTHLY: Returns the start of the current month and the current time.
   * - QUARTER: Returns the start of the current quarter and the current time.
   * - YEARLY: Returns the start of the current year and the current time.
   *
   * @param {TimeSpan} timeSpan - The time span for which to calculate the date range.
   * @returns {Object} An object containing the startDate and endDate formatted for SQL in 'YYYY-MM-DD HH:MM:SS+00' format.
   */
  public calculateCurrentDateRange(timeSpan: TimeSpan) {
    const now = new Date(); // Current date and time in UTC
    let startDate, endDate;

    switch (timeSpan) {
      case TimeSpan.DAILY:
        // Current day's start and end
        startDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        );
        endDate = now;
        break;

      case TimeSpan.WEEKLY:
        // Current week's start (this Monday) and end (today)
        const currentMonday = new Date(now);
        currentMonday.setUTCDate(now.getUTCDate() - now.getUTCDay());
        currentMonday.setUTCHours(0, 0, 0, 0);

        startDate = currentMonday;
        endDate = now;
        break;

      case TimeSpan.MONTHLY:
        // Current month's start and end
        startDate = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          1,
          0,
          0,
          0
        );
        endDate = now;
        break;

      case TimeSpan.LAST_QUARTER:
        // Current quarter's start and end
        const currentQuarterStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
        startDate = new Date(
          now.getUTCFullYear(),
          currentQuarterStartMonth,
          1,
          0,
          0,
          0
        );
        endDate = now;
        break;

      case TimeSpan.YEARLY:
        // Current year's start and end
        startDate = new Date(now.getUTCFullYear(), 0, 1, 0, 0, 0);
        endDate = now;
        break;

      case TimeSpan.ALL:
        // All-time range, from earliest possible date to now
        startDate = new Date("1970-01-01T00:00:00Z"); // Unix epoch start date
        endDate = now;
        break;

      default:
        throw new Error("Unsupported timeSpan value");
    }

    // Format to 'YYYY-MM-DDTHH:MM:SSZ' (ISO 8601) for SQL
    startDate = startDate?.toISOString().slice(0, 19).replace("T", " ") + "+00";
    endDate = endDate?.toISOString().slice(0, 19).replace("T", " ") + "+00";

    return { startDate, endDate };
  }

  // Calculate the last 7 days for daily view
  public calculateLast7Days(): { startDate: string; endDate: string } {
    const today = new Date();
    const last7Days = subDays(today, 6); // 7 days ago
    return {
      startDate: last7Days.toISOString(),
      endDate: today.toISOString(),
    };
  }

  // Calculate the current month and split into weekly intervals (1-7, 8-14, etc.) for weekly view
  public calculateCurrentMonth(): { startDate: string; endDate: string } {
    const startOfCurrentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());

    return {
      startDate: startOfCurrentMonth.toISOString(),
      endDate: endOfCurrentMonth.toISOString(),
    };
  }

  // Calculate the current year (Jan to Dec) for monthly view
  public calculateCurrentYear(): { startDate: string; endDate: string } {
    const startOfCurrentYear = startOfYear(new Date());
    const endOfCurrentYear = endOfYear(new Date());

    return {
      startDate: startOfCurrentYear.toISOString(),
      endDate: endOfCurrentYear.toISOString(),
    };
  }

  // Calculate the date range for the current year and group by quarters for quarterly view
  public calculateQuarterly(): { startDate: string; endDate: string } {
    const startOfCurrentYear = startOfYear(new Date());
    const endOfCurrentYear = endOfYear(new Date());

    return {
      startDate: startOfCurrentYear.toISOString(),
      endDate: endOfCurrentYear.toISOString(),
    };
  }
}
