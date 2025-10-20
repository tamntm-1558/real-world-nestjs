import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { databaseConfig } from "./database/database.config"
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
  ],
})

export class AppModule {}