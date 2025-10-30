import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'I am a developer', description: 'User bio', nullable: true })
  bio: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar image URL', nullable: true })
  image: string;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.bio = user.bio || null;
    this.image = user.image || null;
  }
}
