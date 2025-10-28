import { 
  Controller, 
  Put, 
  Body, 
  UseGuards, 
  Request,
  UnauthorizedException,
  ConflictException
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
import { I18nService } from 'nestjs-i18n';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
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
    const userId = req.user.id;

    // Check if username is being updated and already exists
    if (updateUserDto.username) {
      const existingUser = await this.userService.findExistingUser(
        '',
        updateUserDto.username
      );

      // If found and it's not the current user, throw conflict
      if (existingUser && existingUser.id !== userId) {
        const message = await this.i18n.translate('users.errors.username_already_exists');
        throw new ConflictException(message);
      }
    }

    // Update user
    const updatedUser = await this.userService.updateUser(userId, updateUserDto);

    if (!updatedUser) {
      const message = await this.i18n.translate('auth.errors.user_not_found');
      throw new UnauthorizedException(message);
    }

    const successMessage = await this.i18n.translate('users.success.update_success');

    return new UpdateUserResponseDto(successMessage, updatedUser);
  }
}