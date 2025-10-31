import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    UserModule, // Import UserModule to access UserService if needed
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService], // Export in case other modules need it
})
export class ArticleModule {}
