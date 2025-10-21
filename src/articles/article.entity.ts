import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../tags/tag.entity';
import { BaseEntity } from '../common/base.entity';
import { DEFAULT_FAVORITE_COUNT, FIELD_LENGTH } from '../config/constant';
    
@Entity('articles')
export class Article extends BaseEntity {
    @Column({ unique: true, length: FIELD_LENGTH.SLUG_MAX })
    slug: string;

    @Column({ length: FIELD_LENGTH.TITLE_MAX })
    title: string;

    @Column({ length: FIELD_LENGTH.DESCRIPTION_MAX })
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

    @Column({ default: DEFAULT_FAVORITE_COUNT })
    favoritesCount: number;
}