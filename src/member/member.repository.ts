import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Member, MemberState } from './entities/member.entity';
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

  async getAllMembers(
    userId: number,
    stateOpt: string,
    genderOpt: string,
  ): Promise<Member[]> {
    const query = this.createQueryBuilder('member').where(
      'member.userId=:userId',
      { userId },
    );

    if (stateOpt !== 'total') {
      await query.andWhere('member.state=:state', { state: stateOpt });
    }
    if (genderOpt !== 'total') {
      await query.andWhere('member.gender=:gender', { gender: genderOpt });
    }

    const members = await query
      .leftJoinAndSelect('member.pts', 'pt', 'pt.expired=:expired', {
        expired: false,
      })
      .leftJoinAndSelect('pt.staff', 'staff')
      .select([
        'member.id',
        'member.userId',
        'member.name',
        'member.gender',
        'member.birth',
        'member.phoneNumber',
        'member.registDate',
        'member.state',
        'member.period',
        'member.createdAt',
        'pt.amounts',
        'pt.expired',
        'staff.name',
      ])
      .getMany();

    return members;
  }

  async getMembersByName(userId: number, name: string): Promise<Member[]> {
    const members = await this.createQueryBuilder('member')
      .where('member.userId=:userId', { userId })
      .andWhere('member.name=:name', { name })
      .leftJoinAndSelect('member.pts', 'pt', 'pt.expired=:expired', {
        expired: false,
      })
      .leftJoinAndSelect('pt.staff', 'staff')
      .select([
        'member.id',
        'member.userId',
        'member.name',
        'member.gender',
        'member.birth',
        'member.phoneNumber',
        'member.registDate',
        'member.state',
        'member.period',
        'member.createdAt',
        'pt.amounts',
        'staff.name',
      ])
      .getMany();

    return members;
  }

  async getMemberByPhoneNumber(phoneNumber: string) {
    const member = await this.createQueryBuilder('member')
      .where('member.phoneNumber=:phoneNumber', { phoneNumber })
      .leftJoinAndSelect('member.pts', 'pt', 'pt.expired=:expired', {
        expired: false,
      })
      .leftJoinAndSelect('pt.staff', 'staff')
      .select([
        'member.userId',
        'member.name',
        'member.gender',
        'member.birth',
        'member.registDate',
        'member.state',
        'member.phoneNumber',
        'member.period',
        'member.createdAt',
        'member.phoneNumber',
        'pt.amounts',
        'staff.name',
        'pt.expired',
      ])
      .getOne();
    return member;
  }

  async getMemberById(id: number): Promise<Member> {
    const member = await this.createQueryBuilder('member')
      .where('member.id=:id', { id })
      .leftJoinAndSelect('member.pts', 'pt', 'pt.expired=:expired', {
        expired: false,
      })
      .leftJoinAndSelect('pt.staff', 'staff')
      .select([
        'member.id',
        'member.name',
        'member.gender',
        'member.birth',
        'member.phoneNumber',
        'member.registDate',
        'member.state',
        'member.period',
        'member.createdAt',
        'member.userId',
        'pt.id',
        'pt.registDate',
        'pt.counting',
        'pt.amounts',
        'pt.expired',
        'pt.createdAt',
        'staff.name',
        'staff.gender',
        'staff.phoneNumber',
      ])
      .getOne();

    return member;
  }

  async updateMembersState(
    memberId: number,
    registDate: string,
    period: number,
  ): Promise<void> {
    const member = await this.getMemberById(memberId);

    if (member.state === MemberState.NORMAL) {
      throw new BadRequestException(
        '"Normal" is not suitable for this functionality',
      );
    }

    if (member.state === MemberState.PT) {
      await this.update({ id: memberId }, { registDate, period });

      return;
    }

    await this.update(
      { id: memberId },
      { registDate, state: MemberState.NORMAL, period },
    );
  }

  async updateMemberRegistState(memberId: number, state: MemberState) {
    await this.update({ id: memberId }, { state });
  }
}
