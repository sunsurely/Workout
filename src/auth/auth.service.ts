import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 회원입니다');
    }

    const comparedPassword = await bcrypt.compareSync(password, user.password);
    if (!comparedPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    if (user && comparedPassword) {
      return user;
    }
  }

  async signin(id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(
      { id },
      { refreshToken: currentRefreshToken },
    );

    return { accessToken, refreshToken };
  }

  async removeRefreshToken(id: number) {
    await this.userRepository.update({ id }, { refreshToken: null });
    return;
  }

  async refreshAccessToken(id) {
    const payload = { id };
    const newAccessToken = this.jwtService.sign({ payload });

    return newAccessToken;
  }
}
