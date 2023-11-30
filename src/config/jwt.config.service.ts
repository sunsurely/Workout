import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions() {
    return {
      secret: this.configService.get<string>('TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRATION_TIME'),
    };
  }

  createRefreshTokenOptions() {
    return {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_EXPIRATION_TIME'),
    };
  }
}
