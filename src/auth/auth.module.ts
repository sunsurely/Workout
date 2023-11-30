import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, UsersRepository, JwtConfigService, JwtService],
  controllers: [AuthController],
  exports: [UsersRepository, AuthService],
})
export class AuthModule {}
