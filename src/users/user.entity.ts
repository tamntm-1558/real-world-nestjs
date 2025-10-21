import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Article } from "../articles/article.entity"
import { Comment } from '../comments/comment.entity';
import { FIELD_LENGTH } from '../config/constant';

@Entity('users')
export class User extends BaseEntity {
    @Column({ length: FIELD_LENGTH.USERNAME_MAX })
    username: string;

    @Column({ unique: true, length: FIELD_LENGTH.EMAIL_MAX })
    email: string;

    @Column({ length: FIELD_LENGTH.PASSWORD_MAX })
    password: string;

    @Column({ nullable: true, length: FIELD_LENGTH.BIO_MAX })
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