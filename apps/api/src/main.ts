import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  // We need to look over our cors settings before deploying to production!
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',

      // production origins
      'https://portal.groundsupport.mining.sandvik',
      'https://pulltest.groundsupport.mining.sandvik',
      'https://groundsupport.mining.sandvik',
      'https://xcellbanshee.groundsupport.mining.sandvik',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable multipart form data processing for file uploads
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024 }));

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Serve static files from public directory
  app.useStaticAssets(join(process.cwd(), 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );
  await app.listen(3333, '0.0.0.0');
  console.log(`GraphQL Playground: http://localhost:3333/graphql`);
}
bootstrap();
