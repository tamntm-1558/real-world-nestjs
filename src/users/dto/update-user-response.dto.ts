import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDto {
  @ApiProperty({ example: 'User updated successfully', description: 'Success message' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      username: 'johndoe',
      bio: 'I am a developer',
      image: 'https://example.com/avatar.jpg'
    },
    description: 'Updated user data'
  })
  user: {
    id: number;
    email: string;
    username: string;
    bio: string;
    image: string;
  };

  constructor(message: string, user: any) {
    this.message = message;
    this.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
    };
  }
}
