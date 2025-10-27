import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'I am a developer', description: 'User bio', nullable: true })
  bio: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar image URL', nullable: true })
  image: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT token', required: false })
  token?: string;

  constructor(user: any, token?: string) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.bio = user.bio || null;
    this.image = user.image || null;
    if (token) {
      this.token = token;
    }
  }
}
