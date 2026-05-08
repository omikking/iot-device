import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  // We need to look over our cors settings before deploying to production!
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Enable multipart form data processing for file uploads
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024 }));

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );
  await app.listen(3333);
  console.log(`GraphQL Playground: http://localhost:3333/graphql`);
}
bootstrap();
