import { Controller, Post, Body, BadRequestException, UseGuards, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

/**
 * Controller responsible for user-related endpoints such as registration.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Registers a new user.
   * @param body The request body containing email, password, and name
   * @returns The created user (without password)
   */
  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    const { email, password, name } = body;
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(email, password, name);
    // Exclude password from response
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Example protected route that returns the current user's info.
   * Requires a valid JWT in the Authorization header.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    // req.user is populated by JwtStrategy's validate method
    return req.user;
  }

  /**
   * Get all users (admin only).
   * Requires 'admin' role.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    // In a real app, never expose passwords!
    return this.usersService['usersRepository'].find({ select: ['id', 'email', 'name', 'role'] });
  }

  /**
   * Update own profile (name only for demo).
   * Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateProfile(@Request() req, @Body() body: UpdateUserDto) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    user.name = body.name || user.name;
    await this.usersService['usersRepository'].save(user);
    await this.usersService.logActivity(userId, 'Updated profile');
    const { password, ...result } = user;
    return result;
  }

  /**
   * Delete own account.
   * Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteAccount(@Request() req) {
    const userId = req.user.userId;
    await this.usersService.logActivity(userId, 'Deleted own account');
    await this.usersService['usersRepository'].delete(userId);
    return { message: 'Account deleted' };
  }

  /**
   * View own activity log.
   * Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Get('activity')
  async getOwnActivity(@Request() req) {
    const userId = req.user.userId;
    return this.usersService.getUserActivityLogs(userId);
  }

  /**
   * Admin: View all user activity logs.
   * Requires 'admin' role.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('activity/all')
  async getAllActivity() {
    return this.usersService.getAllActivityLogs();
  }

  /**
   * Change password for the authenticated user.
   * Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    const isMatch = await bcrypt.compare(body.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');
    user.password = await bcrypt.hash(body.newPassword, 10);
    await this.usersService['usersRepository'].save(user);
    await this.usersService.logActivity(userId, 'Changed password');
    return { message: 'Password changed successfully' };
  }
}
