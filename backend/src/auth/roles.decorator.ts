import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to specify required roles for a route.
 * Usage: @Roles('admin')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles); 