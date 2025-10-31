import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../comment.entity';
import { AuthorDto } from 'src/auth/dto/author.dto';

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'This is a great article! Thanks for sharing.' })
  body: string;

  @ApiProperty({ example: '2023-10-29T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-29T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({
    type: AuthorDto,
    description: 'Comment author information',
  })
  author: AuthorDto;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.author = new AuthorDto(comment.author);
  }
}
