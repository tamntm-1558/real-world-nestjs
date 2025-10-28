import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful', description: 'Success message' })
  message: string;

  @ApiProperty({ type: ResponseDto, description: 'User data with token' })
  user: ResponseDto;

  constructor(message: string, user: any, token: string) {
    this.message = message;
    this.user = new ResponseDto(user, token);
  }
}
