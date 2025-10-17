import { Article } from "../articles/article.entity"
import { Comment } from "../comments/comment.entity"
import { Tag } from "../tags/tag.entity"
import { User } from "../users/user.entity"
import { DataSource } from "typeorm"
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "realworld",
  entities: [User, Article, Comment, Tag],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, // Set to false for production
})
