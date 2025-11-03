import { 
  Controller, 
  Get,
  Put, 
  Post,
  Delete,
  Body, 
  Param,
  UseGuards, 
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
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

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get other user profile by username' })
  @ApiParam({
    name: 'username',
    description: 'Username of the profile to retrieve',
    example: 'johndoe',
  })
  @ApiResponse({ 
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(
    @Param('username') username: string,
    @Request() req,
  ): Promise<{ profile: ProfileResponseDto }> {
    const currentUserId = req.user.id;
    return await this.userService.getProfile(username, currentUserId);
  }

  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to follow',
    example: 'johndoe',
  })
  @ApiResponse({ 
    status: 200,
    description: 'User followed successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async followUser(
    @Param('username') username: string,
    @Request() req,
  ): Promise<{ profile: ProfileResponseDto }> {
    return await this.userService.followUser(username, req.user.id);
  }

  @Delete(':username/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to unfollow',
    example: 'johndoe',
  })
  @ApiResponse({ 
    status: 200,
    description: 'User unfollowed successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async unfollowUser(
    @Param('username') username: string,
    @Request() req,
  ): Promise<{ profile: ProfileResponseDto }> {
    return await this.userService.unfollowUser(username, req.user.id);
  }
}