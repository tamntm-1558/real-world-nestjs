import { IsString, IsArray, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FIELD_LENGTH } from '../../config/constant';

export class UpdateArticleDto {
  @ApiProperty({
    example: 'Updated article title',
    description: 'Article title',
    required: false,
    minLength: FIELD_LENGTH.TITLE_MIN,
    maxLength: FIELD_LENGTH.TITLE_MAX,
  })
  @IsOptional()
  @IsString()
  @MinLength(FIELD_LENGTH.TITLE_MIN, {
    message: i18nValidationMessage('common.validation.min_length', {
      field: 'Title',
      min: FIELD_LENGTH.TITLE_MIN
    }),
  })
  @MaxLength(FIELD_LENGTH.TITLE_MAX, {
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Title',
      max: FIELD_LENGTH.TITLE_MAX
    }),
  })
  title?: string;

  @ApiProperty({
    example: 'Updated article description',
    description: 'Article description',
    required: false,
    maxLength: FIELD_LENGTH.DESCRIPTION_MAX,
  })
  @IsOptional()
  @IsString()
  @MaxLength(FIELD_LENGTH.DESCRIPTION_MAX, {
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Description',
      max: FIELD_LENGTH.DESCRIPTION_MAX
    }),
  })
  description?: string;

  @ApiProperty({
    example: 'Updated article body content...',
    description: 'Article body (full content)',
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    example: ['nestjs', 'typescript', 'updated'],
    description: 'List of tags',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[];
}
