import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'realworld',
  entities: ["src/**/**/*.entity*.ts"],
  synchronize: false,
  logging: false,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migration_table',
  migrationsRun: false,
};
