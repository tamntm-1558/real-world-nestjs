import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    } from 'typeorm';
import { User } from '../users/user.entity';
import { Article } from '../articles/article.entity';

@Entity('comments')
export class Comment {
@PrimaryGeneratedColumn()
id: number;

@Column('text')
body: string;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

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