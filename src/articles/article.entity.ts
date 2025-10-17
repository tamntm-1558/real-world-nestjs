import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../tags/tag.entity';
import { BaseEntity } from '../common/base.entity';
    
@Entity('articles')
export class Article extends BaseEntity {
    @Column({ unique: true })
    slug: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column('text')
    body: string;

    @Column('simple-array')
    tagList: string[];

    @ManyToOne(() => User, user => user.articles, { eager: true })
    author: User;

    @OneToMany(
        () => Comment,
        (comment) => comment.article,
    )
    comments: Comment[]

    @ManyToMany(
        () => Tag,
        (tag) => tag.articles,
        { eager: true },
    )
    @JoinTable({
        name: "article_tags",
        joinColumn: { name: "article_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
    })
    tags: Tag[]

    @ManyToMany(() => User)
    @JoinTable()
    favoritedBy: User[];

    @Column({ default: 0 })
    favoritesCount: number;
}