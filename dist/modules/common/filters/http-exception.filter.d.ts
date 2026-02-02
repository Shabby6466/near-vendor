import { ExceptionFilter, ArgumentsHost, LoggerService } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly loggerService;
    constructor(loggerService: LoggerService);
    catch(exception: any, host: ArgumentsHost): any;
}
