import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Global prefix ---
  const configService = app.get(ConfigService);
  
  // --- i18n Validation Pipe ---
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- i18n Exception Filter ---
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  
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
