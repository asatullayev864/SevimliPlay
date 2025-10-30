import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function start() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  const config = app.get(ConfigService);
  const PORT = config.get<number>("PORT") ?? 3030;

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(PORT ?? 3030, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}/api`);
  });
}
start();
