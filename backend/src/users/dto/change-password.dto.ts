import { IsString } from 'class-validator';

/**
 * DTO for changing user password.
 */
export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
} 