import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersRepository } from '../user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userRepository: UsersRepository,
  ) {
    super({
      secretOrKey: configService.get<string>('TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const { nickname } = payload;
    const user = await this.userRepository.getUserNickname(nickname);
    if (!user) {
      throw new UnauthorizedException('Not found user');
    }
    return user;
  }
}
