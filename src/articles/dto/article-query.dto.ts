import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION } from '../../config/constant';

export class ArticleQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by tag',
    example: 'nodejs',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filter by author username',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Filter by user who favorited the article',
    example: 'jane',
  })
  @IsOptional()
  @IsString()
  favorited?: string;

  @ApiPropertyOptional({
    description: 'Limit number of articles returned',
    default: PAGINATION.DEFAULT_LIMIT,
    minimum: PAGINATION.MIN_LIMIT,
    maximum: PAGINATION.MAX_LIMIT,
    example: PAGINATION.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_LIMIT)
  @Max(PAGINATION.MAX_LIMIT)
  limit?: number = PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    default: PAGINATION.DEFAULT_OFFSET,
    minimum: PAGINATION.MIN_OFFSET,
    example: PAGINATION.DEFAULT_OFFSET,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_OFFSET)
  offset?: number = PAGINATION.DEFAULT_OFFSET;
}
