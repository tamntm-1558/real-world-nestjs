import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FIELD_LENGTH } from '../../config/constant';

export class CreateArticleDto {
  @ApiProperty({
    example: 'This is title article',
    description: 'Article title',
    minLength: FIELD_LENGTH.TITLE_MIN,
    maxLength: FIELD_LENGTH.TITLE_MAX,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.required', {
      field: 'Title'
    })
  })
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
  title: string;

  @ApiProperty({
    example: 'Learn how to create a production-ready NestJS application',
    description: 'Article description',
    maxLength: FIELD_LENGTH.DESCRIPTION_MAX,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.required', {
      field: 'Description'
    })
  })
  @IsString()
  @MaxLength(FIELD_LENGTH.DESCRIPTION_MAX, {
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Description',
      max: FIELD_LENGTH.DESCRIPTION_MAX
    }),
  })
  description: string;

  @ApiProperty({
    example: 'This is the full content of the article...',
    description: 'Article body (full content)',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.required', {
      field: 'Body'
    })
  })
  @IsString()
  body: string;

  @ApiProperty({
    example: ['nestjs', 'nodejs'],
    description: 'List of tags',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[];
}
