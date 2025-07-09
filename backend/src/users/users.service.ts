import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ActivityLog } from './activity-log.entity';

/**
 * Service responsible for user management logic such as registration and lookup.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * Creates a new user with a hashed password.
   * @param email User's email address
   * @param password User's plain password
   * @param name User's name
   * @param role User's role (default: 'user')
   * @returns The created user entity
   */
  async create(email: string, password: string, name: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword, name, role });
    return this.usersRepository.save(user);
  }

  /**
   * Finds a user by their email address.
   * @param email User's email
   * @returns The user entity or undefined
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  /**
   * Finds a user by their unique ID.
   * @param id User's ID
   * @returns The user entity or undefined
   */
  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  /**
   * Logs a user activity.
   * @param userId The user's ID
   * @param action The action performed
   */
  async logActivity(userId: number, action: string): Promise<void> {
    const log = this.activityLogRepository.create({ userId, action });
    await this.activityLogRepository.save(log);
  }

  /**
   * Gets all activity logs for a specific user.
   * @param userId The user's ID
   */
  async getUserActivityLogs(userId: number): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({ where: { userId }, order: { timestamp: 'DESC' } });
  }

  /**
   * Gets all activity logs (admin only).
   */
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({ order: { timestamp: 'DESC' } });
  }
}
