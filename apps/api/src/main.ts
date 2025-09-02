import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // We need to look over our cors settings before deploying to production!
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );
  await app.listen(3333, '0.0.0.0');
  console.log(`GraphQL Playground: http://localhost:3333/graphql`);
}
bootstrap();
