import { Article } from "../articles/article.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { BaseEntity } from "../common/base.entity"

@Entity("tags")
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string

  @ManyToMany(
    () => Article,
    (article) => article.tags,
  )
  articles: Article[]
}