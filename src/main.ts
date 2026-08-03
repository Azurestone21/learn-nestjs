import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 全局验证管道
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局异常过滤器
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
