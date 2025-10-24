import { IsEmail, IsString, IsNotEmpty, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { VALIDATION_REGEX } from "../../config/constant"
import { i18nValidationMessage } from 'nestjs-i18n'

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    format: 'email',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.required', {
      field: 'Email'
    })
   })
  @IsEmail({}, {
    message: i18nValidationMessage('common.validation.invalid', {
      field: 'Email'
    })
  })
  @Matches(VALIDATION_REGEX.EMAIL, { message: i18nValidationMessage('common.validation.invalid', {
      field: 'Email'
    }),
   })
  email: string

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
  })
  @IsNotEmpty({ message: i18nValidationMessage('common.validation.required', {
      field: 'Password'
    }) 
   })
  @IsString()
  password: string
}
