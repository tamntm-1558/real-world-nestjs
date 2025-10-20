import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';
import { Article } from '../articles/article.entity';
import { FIELD_LENGTH } from '../config/constant';

@Entity('comments')
export class Comment extends BaseEntity {
    @Column({ type: 'text' })
    body: string;

    @ManyToOne(() => Article, (article) => article.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'articleId' })
    article: Article;

    @Column()
    articleId: number;

    @ManyToOne(() => User, (user) => user.comments, {
        eager: true,
    })
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    authorId: number;
}