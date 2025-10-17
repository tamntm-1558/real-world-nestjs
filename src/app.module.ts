import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Article } from "./articles/article.entity"
import { Comment } from "./comments/comment.entity"
import { Tag } from "./tags/tag.entity"
import { User } from "./users/user.entity"
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || "realworld",
      entities: [User, Article, Comment, Tag],
      synchronize: false,
      logging: false,
    }),
  ],
})

export class AppModule {}