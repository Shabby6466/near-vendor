"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = exports.Duration = exports.FileType = exports.WeekDay = exports.Month = exports.DateFilterType = exports.TimeSpan = exports.NodeEnv = exports.EnNumber = exports.AccountStatus = exports.JobExpression = exports.UserStatus = exports.ResponseCode = exports.ResponseMessage = void 0;
var ResponseMessage;
(function (ResponseMessage) {
    ResponseMessage["SUCCESS"] = "Success";
    ResponseMessage["INVALID_TOKEN"] = "Invalid token";
    ResponseMessage["USER_NOT_FOUND"] = "User not found";
    ResponseMessage["INVALID_INPUT"] = "Invalid Input";
    ResponseMessage["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    ResponseMessage["INVALID_IMAGE_FORMAT"] = "Invalid Image Format";
    ResponseMessage["INVALID_FILE_FORMAT"] = "Invalid File Format";
    ResponseMessage["BUYER_PHONE_NUMBER_NOT_FOUND"] = "Buyer phone number not found";
    ResponseMessage["BUYER_NOT_FOUND"] = "Buyer not found";
    ResponseMessage["GENERIC_ERROR"] = "Generic Error";
    ResponseMessage["SELLER_NOT_FOUND"] = "Seller Not found";
    ResponseMessage["SHOP_NOT_FOUND"] = "Shop Not found";
    ResponseMessage["FORBIDDEN_ACCESS"] = "Forbidden Access";
    ResponseMessage["INVALID_CREDENTIALS"] = "Invalid Credentials";
    ResponseMessage["AUTH_HEADER_MISSING"] = "Auth Header Missing";
    ResponseMessage["AUTH_HEADER_MALFORMED"] = "Auth Header Malformed";
    ResponseMessage["INSUFFICIENT_ROLE"] = "Insufficient Role";
    ResponseMessage["USER_INACTIVE"] = "User Inactive";
    ResponseMessage["USER_SUSPENDED"] = "User Suspended";
    ResponseMessage["PHONE_NUMBER_ALREADY_EXISTS"] = "Phone number already exists";
    ResponseMessage["INVALID_ROLE"] = "Invalid Role";
    ResponseMessage["INVALID_DATE"] = "Invalid date";
    ResponseMessage["INVALID_ZIP_CODE"] = "Invalid zip code";
})(ResponseMessage || (exports.ResponseMessage = ResponseMessage = {}));
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["SUCCESS"] = 200] = "SUCCESS";
    ResponseCode[ResponseCode["CREATED_SUCCESSFULLY"] = 201] = "CREATED_SUCCESSFULLY";
    ResponseCode[ResponseCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ResponseCode[ResponseCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseCode[ResponseCode["CONTENT_NOT_FOUND"] = 204] = "CONTENT_NOT_FOUND";
    ResponseCode[ResponseCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseCode[ResponseCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseCode[ResponseCode["INVALID_INPUT"] = 402] = "INVALID_INPUT";
    ResponseCode[ResponseCode["INVALID_IMAGE_FORMAT"] = 403] = "INVALID_IMAGE_FORMAT";
    ResponseCode[ResponseCode["INVALID_FILE_FORMAT"] = 405] = "INVALID_FILE_FORMAT";
    ResponseCode[ResponseCode["BUYER_PHONE_NUMBER_NOT_FOUND"] = 406] = "BUYER_PHONE_NUMBER_NOT_FOUND";
    ResponseCode[ResponseCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ResponseCode[ResponseCode["BUYER_NOT_FOUND"] = 407] = "BUYER_NOT_FOUND";
    ResponseCode[ResponseCode["GENERIC_ERROR"] = 505] = "GENERIC_ERROR";
    ResponseCode[ResponseCode["SELLER_NOT_FOUND"] = 408] = "SELLER_NOT_FOUND";
    ResponseCode[ResponseCode["SHOP_NOT_FOUND"] = 409] = "SHOP_NOT_FOUND";
    ResponseCode[ResponseCode["FORBIDDEN_ACCESS"] = 505] = "FORBIDDEN_ACCESS";
    ResponseCode[ResponseCode["INVALID_CREDENTIALS"] = 401] = "INVALID_CREDENTIALS";
    ResponseCode[ResponseCode["AUTH_HEADER_MISSING"] = 401] = "AUTH_HEADER_MISSING";
    ResponseCode[ResponseCode["AUTH_HEADER_MALFORMED"] = 401] = "AUTH_HEADER_MALFORMED";
    ResponseCode[ResponseCode["INSUFFICIENT_ROLE"] = 403] = "INSUFFICIENT_ROLE";
    ResponseCode[ResponseCode["USER_INACTIVE"] = 401] = "USER_INACTIVE";
    ResponseCode[ResponseCode["INVALID_TOKEN"] = 401] = "INVALID_TOKEN";
    ResponseCode[ResponseCode["USER_SUSPENDED"] = 401] = "USER_SUSPENDED";
    ResponseCode[ResponseCode["USER_NOT_FOUND"] = 401] = "USER_NOT_FOUND";
    ResponseCode[ResponseCode["PHONE_NUMBER_ALREADY_EXISTS"] = 406] = "PHONE_NUMBER_ALREADY_EXISTS";
    ResponseCode[ResponseCode["INVALID_ROLE"] = 402] = "INVALID_ROLE";
})(ResponseCode || (exports.ResponseCode = ResponseCode = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var JobExpression;
(function (JobExpression) {
    JobExpression["EVERY_SECOND"] = "* * * * * *";
    JobExpression["EVERY_15_MINUTES"] = "*/15 * * * *";
})(JobExpression || (exports.JobExpression = JobExpression = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "Active";
    AccountStatus["DISABLE"] = "Disabled";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var EnNumber;
(function (EnNumber) {
    EnNumber[EnNumber["ZERO"] = 0] = "ZERO";
    EnNumber[EnNumber["ONE"] = 1] = "ONE";
    EnNumber[EnNumber["THREE"] = 3] = "THREE";
    EnNumber[EnNumber["SIX"] = 6] = "SIX";
    EnNumber[EnNumber["SEVEN"] = 7] = "SEVEN";
    EnNumber[EnNumber["TEN"] = 10] = "TEN";
    EnNumber[EnNumber["HUNDRED"] = 100] = "HUNDRED";
    EnNumber[EnNumber["SIX_HUNDRED"] = 600] = "SIX_HUNDRED";
    EnNumber[EnNumber["THOUSAND"] = 1000] = "THOUSAND";
})(EnNumber || (exports.EnNumber = EnNumber = {}));
var NodeEnv;
(function (NodeEnv) {
    NodeEnv["TEST"] = "test";
    NodeEnv["DEVELOPMENT"] = "development";
    NodeEnv["PRODUCTION"] = "production";
})(NodeEnv || (exports.NodeEnv = NodeEnv = {}));
var TimeSpan;
(function (TimeSpan) {
    TimeSpan["DAILY"] = "daily";
    TimeSpan["WEEKLY"] = "weekly";
    TimeSpan["MONTHLY"] = "monthly";
    TimeSpan["LAST_QUARTER"] = "lastQuarter";
    TimeSpan["YEARLY"] = "yearly";
    TimeSpan["ALL"] = "all";
})(TimeSpan || (exports.TimeSpan = TimeSpan = {}));
var DateFilterType;
(function (DateFilterType) {
    DateFilterType["WEEKLY"] = "weekly";
    DateFilterType["MONTHLY"] = "monthly";
    DateFilterType["YEARLY"] = "yearly";
})(DateFilterType || (exports.DateFilterType = DateFilterType = {}));
var Month;
(function (Month) {
    Month["JANUARY"] = "Jan";
    Month["FEBRUARY"] = "Feb";
    Month["MARCH"] = "Mar";
    Month["APRIL"] = "Apr";
    Month["MAY"] = "May";
    Month["JUNE"] = "Jun";
    Month["JULY"] = "Jul";
    Month["AUGUST"] = "Aug";
    Month["SEPTEMBER"] = "Sep";
    Month["OCTOBER"] = "Oct";
    Month["NOVEMBER"] = "Nov";
    Month["DECEMBER"] = "Dec";
})(Month || (exports.Month = Month = {}));
var WeekDay;
(function (WeekDay) {
    WeekDay["SUNDAY"] = "Sunday";
    WeekDay["MONDAY"] = "Monday";
    WeekDay["TUESDAY"] = "Tuesday";
    WeekDay["WEDNESDAY"] = "Wednesday";
    WeekDay["THURSDAY"] = "Thursday";
    WeekDay["FRIDAY"] = "Friday";
    WeekDay["SATURDAY"] = "Saturday";
})(WeekDay || (exports.WeekDay = WeekDay = {}));
var FileType;
(function (FileType) {
    FileType["CSV"] = "CSV";
    FileType["PDF"] = "PDF";
})(FileType || (exports.FileType = FileType = {}));
var Duration;
(function (Duration) {
    Duration["ONE"] = "1";
    Duration["TWO"] = "2";
    Duration["FIVE"] = "5";
})(Duration || (exports.Duration = Duration = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["BUYER"] = "BUYER";
    UserRoles["SELLER"] = "SELLER";
    UserRoles["VENDOR"] = "VENDOR";
    UserRoles["SUPERADMIN"] = "SUPERADMIN";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
//# sourceMappingURL=index.js.map