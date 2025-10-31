import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { FIELD_LENGTH } from '../../config/constant';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment body',
    minLength: FIELD_LENGTH.COMMENT_MIN,
    maxLength: FIELD_LENGTH.COMMENT_MAX,
    example: 'This is a great article! Thanks for sharing.',
  })
  @IsNotEmpty()
  @IsString()
  @Length(FIELD_LENGTH.COMMENT_MIN, FIELD_LENGTH.COMMENT_MAX)
  body: string;
}
