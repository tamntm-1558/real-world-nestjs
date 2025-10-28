import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { SALT_HASH_PASSWORD } from 'src/config/constant';

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
}
