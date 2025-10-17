import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';
import { Article } from '../articles/article.entity';

@Entity('comments')
export class Comment extends BaseEntity {
    @Column('text')
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