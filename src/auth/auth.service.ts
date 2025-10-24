import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { User } from "../users/user.entity"
import { I18nService } from "nestjs-i18n"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    })

    if (existingUser) {
      const message = await this.i18n.translate('auth.errors.user_already_exists');
      throw new ConflictException(message);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    })

    await this.userRepository.save(user)

    // Generate token
    const token = this.generateToken(user)

    const successMessage = await this.i18n.translate('auth.success.registration_success');

    return {
      message: successMessage,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      const message = await this.i18n.translate('auth.errors.invalid_credentials');
      throw new UnauthorizedException(message);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      const message = await this.i18n.translate('auth.errors.invalid_credentials');
      throw new UnauthorizedException(message);
    }

    // Generate token
    const token = this.generateToken(user)

    const successMessage = await this.i18n.translate('auth.success.login_success');

    return {
      message: successMessage,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token,
      },
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, username: user.username }
    return this.jwtService.sign(payload)
  }
}
