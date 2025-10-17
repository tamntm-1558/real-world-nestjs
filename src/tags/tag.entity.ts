import { Article } from "../articles/article.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @ManyToMany(
    () => Article,
    (article) => article.tags,
  )
  articles: Article[]
}