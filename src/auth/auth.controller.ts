import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signin(@Res() res: Response, @Req() req: any) {
    const tokenResult = await this.authService.signin(req.user.id);
    res.cookie('access_token', tokenResult.accessToken);
    res.cookie('refresh_token', tokenResult.refreshToken);

    return res.json({ message: '로그인 성공' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.removeRefreshToken(req.user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return '로그아웃 성공';
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('/refresh')
  async refreshAccessToken(@Req() req: any, @Res() res: Response) {
    const newAccessToken = await this.authService.refreshAccessToken(
      req.user.id,
    );

    res.cookie('access_token', newAccessToken);
    return res.json({ message: '엑세스토큰 갱신' });
  }
}
