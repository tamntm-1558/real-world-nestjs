import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AppDataSource } from "./config/typeorm.config"
import configuration from "./config/configuration"
import { AuthModule } from "./auth/auth.module"
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n"
import { config } from 'dotenv';
import * as path from 'path';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}