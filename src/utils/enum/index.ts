export enum ResponseMessage {
  SUCCESS = "Success",
  INVALID_TOKEN = 'Invalid token',
  USER_NOT_FOUND = "User not found",
  INVALID_INPUT = "Invalid Input",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  INVALID_IMAGE_FORMAT = "Invalid Image Format",
  INVALID_FILE_FORMAT = "Invalid File Format",
  BUYER_PHONE_NUMBER_NOT_FOUND = "Buyer phone number not found",
  BUYER_NOT_FOUND = 'Buyer not found',
  GENERIC_ERROR = 'Generic Error',
  SELLER_NOT_FOUND = 'Seller Not found',
  SHOP_NOT_FOUND = 'Shop Not found',
  FORBIDDEN_ACCESS = 'Forbidden Access',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  AUTH_HEADER_MISSING = 'Auth Header Missing',
  AUTH_HEADER_MALFORMED = 'Auth Header Malformed',
  INSUFFICIENT_ROLE = 'Insufficient Role',
  USER_INACTIVE = 'User Inactive',
  USER_SUSPENDED = 'User Suspended',
  PHONE_NUMBER_ALREADY_EXISTS = 'Phone number already exists',
  INVALID_ROLE = 'Invalid Role',
  INVALID_DATE = "Invalid date",
  INVALID_ZIP_CODE = "Invalid zip code",
  INVALID_COORDINATES = "Invalid coordinates",
}

export enum ResponseCode {
  SUCCESS = 200,
  CREATED_SUCCESSFULLY = 201,
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
  CONTENT_NOT_FOUND = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INVALID_INPUT = 402,
  INVALID_IMAGE_FORMAT = 403,
  INVALID_FILE_FORMAT = 405,
  BUYER_PHONE_NUMBER_NOT_FOUND = 406,
  INTERNAL_SERVER_ERROR = 500,
  BUYER_NOT_FOUND = 407,
  GENERIC_ERROR = 505,
  SELLER_NOT_FOUND = 408,
  SHOP_NOT_FOUND = 409,
  FORBIDDEN_ACCESS = 505,
  INVALID_CREDENTIALS = 401,
  AUTH_HEADER_MISSING = 401,
  AUTH_HEADER_MALFORMED = 401,
  INSUFFICIENT_ROLE = 403,
  USER_INACTIVE = 401,
  INVALID_TOKEN = 401,
  USER_SUSPENDED = 401,
  USER_NOT_FOUND = 401,


  PHONE_NUMBER_ALREADY_EXISTS = 406,
  INVALID_ROLE = 402,
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
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
  BUYER = "BUYER",
  SELLER = "SELLER",
  VENDOR = "VENDOR",
  SUPERADMIN = "SUPERADMIN",
}