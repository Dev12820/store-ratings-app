import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend communication
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  await app.listen(3001); // Use a different port like 3001
}
bootstrap();