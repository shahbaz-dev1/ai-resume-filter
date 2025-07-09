import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating user profile information.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
} 