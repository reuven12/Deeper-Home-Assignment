import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  await app.listen(port);
}
bootstrap();
