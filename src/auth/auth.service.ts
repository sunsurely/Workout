import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signup({
    email,
    nickname,
    password,
  }: AuthDto.CreateUser): Promise<void> {
    const existUser = await this.userRepository.getUserByEmail(email);
    if (existUser) throw new ConflictException('Existing email');

    const existNickname = await this.userRepository.getUserNickname(nickname);
    if (existNickname) throw new ConflictException('Existing nickname');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.createUser(email, nickname, hashedPassword);
  }

  async signin(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.getToken(user.nickname);
    const refreshToken = this.getToken(user.nickname);
    await this.userRepository.update(
      { nickname: user.nickname },
      { refreshToken },
    );

    return { accessToken, refreshToken };
  }

  async logout(nickname: string): Promise<void> {
    await this.userRepository.removeRefreshToken(nickname);
  }

  getToken(nickname: string) {
    const payload = { nickname };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Not found user');

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword)
      throw new UnauthorizedException('Password does not match');
    return user;
  }

  async validateRefreshToken(
    user: User,
    bearerToken: string,
  ): Promise<{ accessToken: string }> {
    const refreshToken = bearerToken.replace('Bearer', '').trim();

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = await this.getToken(user.nickname);
    return { accessToken };
  }
}
