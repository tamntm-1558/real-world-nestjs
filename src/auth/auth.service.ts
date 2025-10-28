import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { RegisterResponseDto } from "./dto/register-response.dto"
import { LoginResponseDto } from "./dto/login-response.dto"
import { User } from "../users/user.entity"
import { I18nService } from "nestjs-i18n"
import { UserService } from "../users/user.service"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto

    // Check if user exists
    const userExists = await this.userService.checkUserExists(email, username);
    
    if (userExists) {
      const message = await this.i18n.translate('auth.errors.user_already_exists');
      throw new ConflictException(message);
    }

    // Create user
    const user = await this.userService.createUser(email, username, password);

    // Generate token
    const token = this.generateToken(user)

    const successMessage = await this.i18n.translate('auth.success.registration_success');

    return new RegisterResponseDto(successMessage, user, token);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user with password
    const user = await this.userService.findByEmail(email, true);

    if (!user) {
      const message = await this.i18n.translate('auth.errors.invalid_credentials');
      throw new UnauthorizedException(message);
    }

    // Verify password
    const isPasswordValid = await this.userService.verifyPassword(user, password);

    if (!isPasswordValid) {
      const message = await this.i18n.translate('auth.errors.invalid_credentials');
      throw new UnauthorizedException(message);
    }

    // Generate token
    const token = this.generateToken(user)

    const successMessage = await this.i18n.translate('auth.success.login_success');

    return new LoginResponseDto(successMessage, user, token);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email, true);
    if (user && await this.userService.verifyPassword(user, password)) {
      return this.userService.getUserProfile(user);
    }
    return null;
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      const message = await this.i18n.translate('auth.errors.user_not_found');
      throw new UnauthorizedException(message);
    }

    return {
      user: this.userService.getUserProfile(user),
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, username: user.username }
    return this.jwtService.sign(payload)
  }
}
