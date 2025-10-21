import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppDataSource } from "./config/typeorm.config"
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
})

export class AppModule {}