import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // We need to look over our cors settings before deploying to production!
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3001',

      // production origins
      'https://portal.groundsupport.mining.sandvik',
      'https://pulltest.groundsupport.mining.sandvik',
      'https://groundsupport.mining.sandvik',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );
  await app.listen(3333, '0.0.0.0');
  console.log(`GraphQL Playground: http://localhost:3333/graphql`);
}
bootstrap();
