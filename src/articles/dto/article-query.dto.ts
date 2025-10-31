import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PAGINATION } from '../../config/constant';

export class ArticleQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by tags. Use comma-separated values for multiple tags (e.g., "nestjs,typescript") or repeat the parameter (?tag=nestjs&tag=typescript)',
    example: 'nestjs,typescript',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.includes(',')) {
        return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      return [value]; // Convert single string to array
    }
    if (Array.isArray(value)) {
      return value; // Keep array as is
    }
    return undefined;
  })
  @IsArray({ message: 'tag must be a string or an array of strings' })
  @IsString({ each: true })
  tag?: string[];

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
