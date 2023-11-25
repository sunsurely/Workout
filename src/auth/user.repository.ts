import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async getUserNickname(nickname: string): Promise<User> {
    return this.findOne({ where: { nickname } });
  }

  async createUser(
    email: string,
    nickname: string,
    password: string,
  ): Promise<void> {
    const newUser = await this.create({
      email,
      nickname,
      password,
    });

    await this.save(newUser);
  }

  async removeRefreshToken(nickname: string): Promise<void> {
    const user = await this.findOne({ where: { nickname } });
    user.refreshToken = null;
    this.save(user);
  }
}
