import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from 'src/auth/dto/author.dto';

export class ArticleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'this-is-title-article' })
  slug: string;

  @ApiProperty({ example: 'This is title article' })
  title: string;

  @ApiProperty({ example: 'Learn how to create a production-ready NestJS application' })
  description: string;

  @ApiProperty({ example: 'This is the full content of the article...' })
  body: string;

  @ApiProperty({ example: ['language', 'nestjs', 'nodejs'], type: [String] })
  tagList: string[];

  @ApiProperty({ 
    type: AuthorDto,
    description: 'Article author information'
  })
  author: AuthorDto;

  @ApiProperty({ example: 0 })
  favoritesCount: number;

  @ApiProperty({ example: false })
  favorited: boolean;

  @ApiProperty({ example: '2025-10-27T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-27T10:00:00.000Z' })
  updatedAt: Date;

  constructor(article: any, currentUserId?: number) {
    this.id = article.id;
    this.slug = article.slug;
    this.title = article.title;
    this.description = article.description;
    this.body = article.body;
    this.tagList = article.tagList || [];
    this.author = new AuthorDto(article.author);
    this.favoritesCount = article.favoritesCount || 0;
    this.favorited = !!(currentUserId && article.favoritedBy?.some((user: any) => user.id === currentUserId));
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
  }
}
