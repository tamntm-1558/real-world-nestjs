import { 
  Controller, 
  Put, 
  Body, 
  UseGuards, 
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile (username, bio, image)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully', 
    type: UpdateUserResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return await this.userService.updateUserProfile(req.user.id, updateUserDto);
  }
}