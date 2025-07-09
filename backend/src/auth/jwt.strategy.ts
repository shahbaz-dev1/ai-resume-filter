import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT strategy for validating JWT tokens in protected routes.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default'),
    });
  }

  /**
   * Validate method is called after JWT is verified. The returned value is attached to the request object.
   * @param payload The decoded JWT payload
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
} 