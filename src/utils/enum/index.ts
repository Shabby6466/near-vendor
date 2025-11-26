export enum ResponseMessage {
  SUCCESS = "Success",
  SELF_REFERRAL = "You cannot refer yourself.",
  MORE_THAN_FIVE_INVITES = "This referral code has reached its today's limit of 5 people.",
  DUPLICATE_REFERRAL_CODE = 'You have already used a referral code.',
  INTERNAL_SERVER_ERROR = "Internal server error",
  INVALID_CREDENTIALS = "Invalid credentials",
  UPDATED_SUCCESSFULLY = "Updated successfully",
  INVALID_INPUT = "Invalid input",
  GENERIC_ERROR = "Generic Error",
  INVALID_COUNTRY = "Invalid country",
  INVALID_DATE = "Invalid date",
  INVALID_TIME = "Invalid time",
  INVALID_ZIP_CODE = "Invalid zip code",
  IMAGES_ALLOW = "Image format not supported",
  INVALID_IMAGE_FORMAT = "Invalid file format, allowed images: (jpg,png,jpeg)",
  INVALID_FILE_FORMAT = "Invalid file format, allowed only: (pdf,jpg,png,jpeg,csv)",
  INVALID_PATH_PARAM = "Invalid path parameter",
  EMAIL_CONFIRMED = "Email Confirmed Successfully",
  DEVICE_ALREADY_EXISTS = "Device already exists",
  DEVICE_NOT_FOUND = "Device not found",
  CALENDAR_ALREADY_EXISTS = "Check-in already exists for this date.",
  CALENDAR_NOT_FOUND = "No check-in found for the requested date.",
  INVALID_CALENDAR_DATE = "Invalid date format or missing date.",
  WRONG_CALENDAR_DATE = "Invalid date provided.",
  HUNT_ALREADY_SUBMITTED = "Hunt already submitted today.",
  INVALID_WATTS_SAVED = "Invalid number of watts saved.",
  HUNT_NOT_FOUND = "No hunt record found.",
  INVALID_REFERRAL_CODE = "Invalid referral code.",
  INVALID_PASSWORD = 'Invalid Password',
  PASSWORD_NOT_MATCH = 'Password not match',
  SAME_PASSWORD = 'Old and new password cannot be same',
  INVALID_EMAIL = 'Invalid email',
  ADMIN_CREATION_ERROR = 'ADMIN_CREATION_ERROR',
  ADMIN_EMAIL_NOT_REGISTERED = 'ADMIN_EMAIL_NOT_REGISTERED',
  ADMIN_ALREADY_EXISTS = 'ADMIN_ALREADY_EXISTS',
  TWOFA_ALREADY_ENABLED = 'TWOFA_ALREADY_ENABLED',
  TWOFA_DISABLED = 'TWOFA_DISABLED',
  INVALID_2FA = 'INVALID_2FA',
  INVALID_ADMIN = 'INVALID_ADMIN',
  INACTIVE_ADMIN = 'INACTIVE_ADMIN',
  TWOFA_NOT_CONFIGURED = 'TWOFA_NOT_CONFIGURED',
  USER_SERVICE_ERROR = 'Error processing user request',
  EMAIL_NOT_REGISTERED = 'Email not registered',
  FORGOT_PASSWORD_EMAIL = 'Forgot password email sent successfully',
  RESET_PASSWORD_SUCCESS = 'Password reset successfully',
  TOKEN_EXPIRED = 'Token expired',
  INVALID_TOKEN = 'Invalid token',
  USER_NOT_FOUND = "User not found",
  DASHBOARD_FETCH_ERROR = "Error fetching dashboard data",
}

export enum ResponseCode {
  SUCCESS = 200,
  CREATED_SUCCESSFULLY = 201,
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
  CONTENT_NOT_FOUND = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  GENERIC_ERROR = 600,
  IMAGES_ALLOW = 601,
  USER_NOT_FOUND = 602,
  USER_ALREADY_EXISTS = 603,
  TOKEN_EXPIRED = 604,
  INVALID_INPUT = 605,
  DEVICE_ALREADY_EXISTS = 606,
  DEVICE_NOT_FOUND = 607,

  // Admin
  ADMIN_ALREADY_EXISTS = 102,
  ADMIN_EMAIL_NOT_REGISTERED = 103,
  INVALID_2FA = 104,
  INVALID_ADMIN = 105,
  INACTIVE_ADMIN = 106,
  USER_SERVICE_ERROR = 673,
  TWOFA_NOT_CONFIGURED = 668,
  TWOFA_ALREADY_ENABLED = 669,
  INVALID_TOKEN = 670,
  TWOFA_DISABLED = 671,
  INVALID_PASSWORD = 672,
  INVALID_EMAIL = 673,
  SAME_PASSWORD = 674,
  PASSWORD_NOT_MATCH = 675,
  ADMIN_CREATION_ERROR = 676,
  EMAIL_NOT_REGISTERED = 677,
  FORGOT_PASSWORD_EMAIL = 678,
  RESET_PASSWORD_SUCCESS = 679,
  DASHBOARD_FETCH_ERROR = 680,

}

export enum JobExpression {
  EVERY_SECOND = "* * * * * *",
  EVERY_15_MINUTES = "*/15 * * * *",
}

export enum AccountStatus {
  ACTIVE = "Active",
  DISABLE = "Disabled",
}

export enum EnNumber {
  ZERO = 0,
  ONE = 1,
  THREE = 3,
  SIX = 6,
  SEVEN = 7,
  TEN = 10,
  HUNDRED = 100,
  SIX_HUNDRED = 600,
  THOUSAND = 1000,
}

export enum NodeEnv {
  TEST = "test",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum Frequency {
  ONCE = "once",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export enum TimeSpan {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  LAST_QUARTER = "lastQuarter",
  YEARLY = "yearly",
  ALL = "all",
}

export enum DateFilterType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum Month {
  JANUARY = "Jan",
  FEBRUARY = "Feb",
  MARCH = "Mar",
  APRIL = "Apr",
  MAY = "May",
  JUNE = "Jun",
  JULY = "Jul",
  AUGUST = "Aug",
  SEPTEMBER = "Sep",
  OCTOBER = "Oct",
  NOVEMBER = "Nov",
  DECEMBER = "Dec",
}

export enum WeekDay {
  SUNDAY = "Sunday",
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
}

export enum FileType {
  CSV = "CSV",
  PDF = "PDF",
}

export enum Duration {
  ONE = "1",
  TWO = "2",
  FIVE = "5",
}
export enum UserRoles {
  BUYER = 'buyer',
  SELLER = 'seller',
}