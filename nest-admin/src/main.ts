import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5000',
    credentials: true // credentials: true를 통해 모든 요청에 쿠키를 전달하므로 @Res({ passthrough: true })의 passthrough 옵션 없애도 됨
  });
  await app.listen(3000);
}
bootstrap();
