import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { ActivityLog } from './activity-log.entity';

/**
 * Module responsible for user management and registration.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, ActivityLog])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
