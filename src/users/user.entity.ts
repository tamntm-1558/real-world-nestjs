import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Article } from "../articles/article.entity"
import { Comment } from '../comments/comment.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    image: string;

    @OneToMany(
        () => Article,
        (article) => article.author,
    )
    articles: Article[]

    @OneToMany(
        () => Comment,
        (comment) => comment.author,
    )
    comments: Comment[]
}