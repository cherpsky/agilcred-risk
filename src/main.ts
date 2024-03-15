import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyMiddleware } from 'middleware/api-key.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ApiKeyMiddleware().use);
  await app.listen(3000);
}
bootstrap();
