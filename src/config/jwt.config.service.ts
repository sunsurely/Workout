import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist';
import { UsersRepository } from 'src/auth/user.repository';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('TOKEN_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string>('TOKEN_EXPIRATION_TIME'),
      },
    };
  }
}
