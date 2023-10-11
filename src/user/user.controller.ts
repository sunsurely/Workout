import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/authDTO';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @UseInterceptors(FileInterceptor('image'))
  async signup(
    @Body() authDto: AuthDTO.Signup,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { email, nickname } = authDto;

    const existEmail = await this.userService.findByEmail(email);
    if (existEmail) {
      throw new ConflictException('이미 사용중인 이메일 입니다.');
    }

    const existNickname = await this.userService.findByNickname(nickname);
    if (existNickname) {
      throw new ConflictException('이미 사용중인 닉네임 입니다.');
    }

    await this.userService.create(authDto, file);

    return '회원가입 성공';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getUsersProfile(@Req() req: any) {
    return req.user;
  }
}
