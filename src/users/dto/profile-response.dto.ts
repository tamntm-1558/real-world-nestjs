import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I am a software developer passionate about building great products',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User avatar image URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Whether the current user is following this profile',
    example: false,
  })
  following: boolean;

  constructor(user: User, following: boolean = false) {
    this.username = user.username;
    this.bio = user.bio;
    this.image = user.image;
    this.following = following;
  }
}
