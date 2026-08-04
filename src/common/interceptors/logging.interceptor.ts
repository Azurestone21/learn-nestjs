import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import type { Request } from 'express';

/**
 * 日志拦截器
 * 用于记录请求日志，包括请求URL、耗时等
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const url = request.url;
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`${url} 请求耗时 ${Date.now() - now}ms`)));
  }
}
