import {
  Body,
  Controller,
  Post,
  Req,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) authDto: AuthDto.CreateUser,
  ): Promise<void> {
    await this.authService.signup(authDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signin(
    @Req() req: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signin(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@Req() req: any): Promise<void> {
    await this.authService.logout(req.username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/refresh')
  async refresh(@Req() req: any): Promise<{ accessToken: string }> {
    return this.authService.validateRefreshToken(
      req.user,
      req.headers.authorization,
    );
  }
}
