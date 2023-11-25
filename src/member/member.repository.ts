import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Gender } from 'src/common/types';
import { MemberDTO } from './dto/member.dto';

@Injectable()
export class MemberReppository extends Repository<Member> {
  constructor(private readonly dataSource: DataSource) {
    super(Member, dataSource.createEntityManager());
  }

  async createMember(
    userId: number,
    {
      name,
      gender,
      birth,
      phoneNumber,
      registDate,
      period,
    }: MemberDTO.CreateMember,
  ): Promise<void> {
    const newMember = this.create({
      userId,
      name,
      birth,
      phoneNumber,
      registDate,
      period,
      gender,
    });

    await this.save(newMember);
  }

  async getMemberByPhoneNumber(phoneNumber: string): Promise<Member> {
    return await this.findOne({ where: { phoneNumber } });
  }
}
