import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FIELD_LENGTH, VALIDATION_REGEX } from '../../config/constant';

export class UpdateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(FIELD_LENGTH.USERNAME_MIN, {
    message: i18nValidationMessage('common.validation.min_length', {
      field: 'Username',
      min: FIELD_LENGTH.USERNAME_MIN
    }),
  })
  @MaxLength(FIELD_LENGTH.USERNAME_MAX, {
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Username',
      max: FIELD_LENGTH.USERNAME_MAX
    }),
  })
  @Matches(VALIDATION_REGEX.USERNAME, {
    message: i18nValidationMessage('common.validation.invalid', {
      field: 'Username'
    }),
  })
  username?: string;

  @ApiProperty({
    example: 'I am a software developer passionate about building great products',
    description: 'User biography',
    required: false,
    maxLength: FIELD_LENGTH.BIO_MAX,
  })
  @IsOptional()
  @IsString()
  @MaxLength(FIELD_LENGTH.BIO_MAX, {
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Bio',
      max: FIELD_LENGTH.BIO_MAX
    }),
  })
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
