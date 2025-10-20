import { Article } from "../articles/article.entity"
import { Entity, Column, ManyToMany } from "typeorm"
import { BaseEntity } from "../common/base.entity"
import { FIELD_LENGTH } from "../config/constant"

@Entity("tags")
export class Tag extends BaseEntity {
  @Column({ unique: true, length: FIELD_LENGTH.TAG_NAME_MAX })
  name: string

  @ManyToMany(
    () => Article,
    (article) => article.tags,
  )
  articles: Article[]
}