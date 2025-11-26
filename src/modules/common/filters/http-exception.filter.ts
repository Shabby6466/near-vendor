import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '@utils/enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const res: any = exception instanceof HttpException ? exception.getResponse() : ResponseMessage.INTERNAL_SERVER_ERROR;
    const status: HttpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) this.loggerService.error(exception);

    if (typeof res === 'object') {
      if (res.statusCode === ResponseCode.BAD_REQUEST) {
        res.statusCode = ResponseCode.INVALID_INPUT;
        res.errors = res.message;
        res.message = ResponseMessage.INVALID_INPUT;
      }

      return response.status(status).send(res);
    } else {
      return response.status(status).send({
        statusCode: status,
        message: res,
      });
    }
  }
}
