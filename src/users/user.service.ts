import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { SALT_HASH_PASSWORD } from 'src/config/constant';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private i18n: I18nService,
  ) {}

  /**
   * Check if a user exists by email or username
   * @param email - User's email
   * @param username - User's username
   * @returns The existing user or null
   */
  async findExistingUser(email: string, username?: string): Promise<User | null> {
    const whereConditions = username 
      ? [{ email }, { username }]
      : [{ email }];

    return await this.userRepository.findOne({
      where: whereConditions,
    });
  }

  /**
   * Check if a user exists by email or username
   * @param email - User's email
   * @param username - User's username
   * @returns True if user exists, false otherwise
   */
  async checkUserExists(email: string, username?: string): Promise<boolean> {
    const existingUser = await this.findExistingUser(email, username);
    return !!existingUser;
  }

  /**
   * Find a user by ID
   * @param id - User's ID
   * @returns The user or null
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'username', 'bio', 'image']
    });

    return user;
  }

  /**
   * Find a user by email
   * @param email - User's email
   * @param includePassword - Whether to include password in result
   * @returns The user or null
   */
  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const selectFields = ['id', 'email', 'username', 'bio', 'image'];
    if (includePassword) {
      selectFields.push('password');
    }

    return await this.userRepository.findOne({ 
      where: { email },
      select: selectFields as any
    });
  }

  /**
   * Create a new user with hashed password
   * @param email - User's email
   * @param username - User's username
   * @param password - User's plain password
   * @returns The created user
   */
  async createUser(email: string, username: string, password: string): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_HASH_PASSWORD);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Update user profile
   * @param id - User's ID
   * @param updateData - Data to update
   * @returns The updated user or null if user not found
   */
  async updateUser(id: number, updateData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    
    if (!user) {
      return null;
    }
    
    Object.assign(user, updateData);
    
    return await this.userRepository.save(user);
  }

  /**
   * Verify user password
   * @param user - User entity
   * @param password - Plain password to verify
   * @returns True if password matches
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  /**
   * Get user profile without sensitive data
   * @param user - User entity
   * @returns User profile object
   */
  getUserProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
    };
  }

  /**
   * Update user profile with business logic and error handling
   * @param userId - User's ID
   * @param updateUserDto - Update data
   * @returns Update user response
   */
  async updateUserProfile(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    // Check if username is being updated and already exists
    if (updateUserDto.username) {
      const existingUser = await this.findExistingUser('', updateUserDto.username);

      // If found and it's not the current user, throw conflict
      if (existingUser && existingUser.id !== userId) {
        const message = await this.i18n.translate('users.errors.username_already_exists');
        throw new ConflictException(message);
      }
    }

    // Update user
    const updatedUser = await this.updateUser(userId, updateUserDto);

    if (!updatedUser) {
      const message = await this.i18n.translate('auth.errors.user_not_found');
      throw new UnauthorizedException(message);
    }

    const successMessage = await this.i18n.translate('users.success.update_success');

    return new UpdateUserResponseDto(successMessage, updatedUser);
  }

  /**
   * Get user profile by username with following status
   * @param username - Target user's username
   * @param currentUserId - Current user's ID (optional)
   * @returns Profile with following status
   */
  async getProfile(username: string, currentUserId?: number): Promise<{ profile: ProfileResponseDto }> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['followers'],
    });

    if (!user) {
      const message = await this.i18n.translate('users.errors.user_not_found');
      throw new NotFoundException(message);
    }

    let following = false;
    if (currentUserId) {
      following = user.followers.some(follower => follower.id === currentUserId);
    }

    return {
      profile: new ProfileResponseDto(user, following),
    };
  }

  /**
   * Follow a user
   * @param username - Target user's username
   * @param currentUserId - Current user's ID
   * @returns Updated profile
   */
  async followUser(username: string, currentUserId: number): Promise<{ profile: ProfileResponseDto }> {
    const targetUser = await this.userRepository.findOne({
      where: { username },
      relations: ['followers'],
    });

    if (!targetUser) {
      const message = await this.i18n.translate('users.errors.user_not_found');
      throw new NotFoundException(message);
    }

    if (targetUser.id === currentUserId) {
      const message = await this.i18n.translate('users.errors.cannot_follow_yourself');
      throw new UnauthorizedException(message);
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      const message = await this.i18n.translate('users.errors.user_not_found');
      throw new NotFoundException(message);
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.some(user => user.id === targetUser.id);
    
    if (!isAlreadyFollowing) {
      currentUser.following.push(targetUser);
      await this.userRepository.save(currentUser);
    }

    return {
      profile: new ProfileResponseDto(targetUser, true),
    };
  }

  /**
   * Unfollow a user
   * @param username - Target user's username
   * @param currentUserId - Current user's ID
   * @returns Updated profile
   */
  async unfollowUser(username: string, currentUserId: number): Promise<{ profile: ProfileResponseDto }> {
    const targetUser = await this.userRepository.findOne({
      where: { username },
      relations: ['followers'],
    });

    if (!targetUser) {
      const message = await this.i18n.translate('users.errors.user_not_found');
      throw new NotFoundException(message);
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      const message = await this.i18n.translate('users.errors.user_not_found');
      throw new NotFoundException(message);
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(user => user.id !== targetUser.id);
    await this.userRepository.save(currentUser);

    return {
      profile: new ProfileResponseDto(targetUser, false),
    };
  }

  /**
   * Get user with following relationships
   * @param userId - User ID
   * @returns User with following relationships or null
   */
  async getUserWithFollowing(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
  }
}
