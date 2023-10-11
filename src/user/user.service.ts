import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from 'src/auth/dto/authDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(authDTO: AuthDTO.Signup, file: Express.Multer.File) {
    let imgUrl: string = '';

    if (!file) {
      imgUrl = null;
    }

    const newUser = await this.userRepository.create({ ...authDTO, imgUrl });
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'nickname', 'email', 'password', 'createdAt'],
      where: { email },
    });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({
      select: ['id', 'nickname', 'email', 'createdAt'],
      where: { nickname },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      select: [
        'id',
        'nickname',
        'email',
        'refreshToken',
        'createdAt',
        'password',
      ],
      where: { id },
    });
  }
}
