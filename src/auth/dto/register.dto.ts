import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsNotEmpty 
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { i18nValidationMessage } from 'nestjs-i18n'
import { 
  FIELD_LENGTH, 
  VALIDATION_REGEX 
} from "../../config/constant"
import { Match } from "../../common/decorators/match.decorator"

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    format: 'email',
    minLength: FIELD_LENGTH.EMAIL_MIN,
    maxLength: FIELD_LENGTH.EMAIL_MAX,
  })
  @IsNotEmpty({ message: i18nValidationMessage('common.validation.required', {
      field: 'Email'
    }) 
   })
  @IsEmail({}, {
    message: i18nValidationMessage('common.validation.invalid', {
      field: 'Email'
    })
  })
  @MinLength(FIELD_LENGTH.EMAIL_MIN, { 
    message: i18nValidationMessage('common.validation.min_length', {
      field: 'Email',
      min: FIELD_LENGTH.EMAIL_MIN
    }),
  })
  @MaxLength(FIELD_LENGTH.EMAIL_MAX, { 
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Email',
      max: FIELD_LENGTH.EMAIL_MAX
    }),
  })
  @Matches(VALIDATION_REGEX.EMAIL, {
    message: i18nValidationMessage('common.validation.invalid', {
      field: 'Email'
    }),
   })
  email: string

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username (letters, numbers, underscores only)',
    minLength: FIELD_LENGTH.USERNAME_MIN,
    maxLength: FIELD_LENGTH.USERNAME_MAX,
    pattern: VALIDATION_REGEX.USERNAME.source,
  })
  @IsNotEmpty({ 
    message: i18nValidationMessage('common.validation.required', {
      field: 'Username'
    }) 
  })
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
  username: string

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Strong password (must contain at least one letter, number, and special character)',
    minLength: FIELD_LENGTH.PASSWORD_MIN,
    maxLength: FIELD_LENGTH.PASSWORD_MAX,
    pattern: VALIDATION_REGEX.PASSWORD_STRONG.source,
  })
  @IsNotEmpty({ 
    message: i18nValidationMessage('common.validation.required', {
      field: 'Password'
    }),
  })
  @IsString()
  @MinLength(FIELD_LENGTH.PASSWORD_MIN, { 
    message: i18nValidationMessage('common.validation.min_length', {
      field: 'Password',
      min: FIELD_LENGTH.PASSWORD_MIN
    }),
  })
  @MaxLength(FIELD_LENGTH.PASSWORD_MAX, { 
    message: i18nValidationMessage('common.validation.max_length', {
      field: 'Password',
      max: FIELD_LENGTH.PASSWORD_MAX
    }),
  })
  @Matches(VALIDATION_REGEX.PASSWORD_STRONG, { 
    message: i18nValidationMessage('common.validation.password_weak'),
  })
  password: string

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password confirmation (must match password)',
    minLength: FIELD_LENGTH.PASSWORD_MIN,
    maxLength: FIELD_LENGTH.PASSWORD_MAX,
  })
  @IsString()
  @Match('password', {
    message: i18nValidationMessage('common.validation.password_mismatch'),
  })
  passwordConfirmation: string
}