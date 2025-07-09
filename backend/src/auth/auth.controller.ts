import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller responsible for authentication endpoints such as login.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and returns a JWT access token.
   * @param body The request body containing email and password
   * @returns An object containing the access token
   */
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const { email, password } = body;
    try {
      const user = await this.authService.validateUser(email, password);
      return this.authService.login(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
