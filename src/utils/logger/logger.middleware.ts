import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@utils/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const startTime = Date.now();
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', correlationId);

    this.loggerService.log(`Request: CorelationId:${correlationId} ${method} ${url}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      const logMessage = `Response: CorelationId:${correlationId} ${method} ${url} - ${statusCode} - ${responseTime}ms`;
      this.loggerService.log(logMessage);
    });

    res.on('error', (err) => {
      this.loggerService.error(`Error: CorelationId:${correlationId} ${method} ${url} - ${err.message}`);
    });

    next();
  }
}
