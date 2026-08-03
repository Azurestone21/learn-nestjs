import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch(HttpException) // 捕获 HttpException 异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const standardResponse: ResponseDto<null> = {
      code: statusCode,
      message: exception.message,
      data: null, // 异常时 data 通常为 null
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(standardResponse);
  }
}
