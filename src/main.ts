import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // --- Global prefix ---
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get<string>('prefixApi') || 'api');

  // --- Versioning ---
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('apiVersion'),
  });

  // --- Swagger ---
  const config = new DocumentBuilder()
    .setTitle('RealWorld API')
    .setDescription('NestJS RealWorld API Documentation')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
}
bootstrap();
