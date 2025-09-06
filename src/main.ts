import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // It will filter out fields that we don't need in req.body or not defined in DTO's
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
