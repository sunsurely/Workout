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

    if (stateOpt !== 'total' && genderOpt !== 'total') {
      await query
        .andWhere('member.gender=:gender', { gender: genderOpt })
        .andWhere('member.state=:state', { state: stateOpt });
    } else {
      if (stateOpt !== 'total') {
        await query.andWhere('member.state=:state', { state: stateOpt });
      }
      if (genderOpt !== 'total') {
        await query.andWhere('member.gender=:gender', { gender: genderOpt });
      }
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

  async getMemberByPhoneNumber(phoneNumber: string, userId: number) {
    const member = await this.createQueryBuilder('member')
      .where('member.phoneNumber=:phoneNumber', { phoneNumber })
      .andWhere('member.userId=:userId', { userId })
      .leftJoin('member.pts', 'pt')
      .leftJoinAndSelect('pt.staff', 'staff')
      .select([
        'member.id',
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
      ])
      .getOne();
    return member;
  }

  async getMemberById(id: number, userId: number): Promise<Member> {
    const member = await this.createQueryBuilder('member')
      .where('member.id=:id', { id })
      .andWhere('member.userId=:userId', { userId })
      .leftJoinAndSelect('member.pts', 'pt')
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

  async getAllRecordsByMemberId(
    memberId: number,
    userId: number,
  ): Promise<Member> {
    const result = await this.createQueryBuilder('member')
      .andWhere('member.userId=:userId', { userId })
      .where('member.id=:memberId', { memberId })
      .leftJoinAndSelect('member.records', 'record')
      .leftJoinAndSelect('record.staff', 'staff')
      .leftJoinAndSelect('record.excercisies', 'excercise')
      .select([
        'member.name',
        'member.gender',
        'member.birth',
        'staff.name',
        'record.id',
        'record.createdAt',
        'record.traningDate',
        'excercise.id',
        'excercise.part',
        'excercise.excercise',
        'excercise.set',
      ])
      .getOne();

    return result;
  }

  async getAllRecordsByTrainerId(
    memberId: number,
    trainerId: number,
    userId: number,
  ): Promise<Member> {
    const result = await this.createQueryBuilder('member')
      .where('member.id="memberId', { memberId })
      .andWhere('member.userId=:userId', { userId })
      .leftJoinAndSelect('member.records', 'record')
      .where('record.trainerId=:trainerId', { trainerId })
      .leftJoinAndSelect('record.excercisies', 'excercise')
      .leftJoinAndSelect('record.staff', 'staff')
      .select([
        'member.id',
        'member.name',
        'member.gender',
        'member.birth',
        'staff.name',
        'record.id',
        'record.createdAt',
        'record.traningDate',
        'excercise.id',
        'excercise.part',
        'excercise.excercise',
        'excercise.set',
      ])
      .getOne();

    return result;
  }

  async getRecordById(
    memberId: number,
    recordId: number,
    userId: number,
  ): Promise<Member> {
    const record = await this.createQueryBuilder('member')
      .where('member.id=:memberId', { memberId })
      .andWhere('member.userId=:userId', { userId })
      .leftJoinAndSelect('member.records', 'record')
      .where('record.id=:recordId', { recordId })
      .leftJoinAndSelect('record.excercisies', 'excercise')
      .select([
        'member.id',
        'member.name',
        'member.gender',
        'member.birth',
        'record.id',
        'record.createdAt',
        'record.traningDate',
        'excercise.id',
        'excercise.part',
        'excercise.excercise',
        'excercise.set',
      ])
      .getOne();

    return record;
  }

  async getPTCountingByTrainerId(
    trainerId: number,
    userId: number,
  ): Promise<number> {
    const membersCount = await this.createQueryBuilder('member')
      .innerJoin('member.pts', 'pt')
      .where('member.userId=:userId', { userId })
      .andWhere('pt.trainerId=:trainerId', { trainerId })
      .andWhere('pt.expired=:expired', { expired: false })
      .getCount();
    return membersCount;
  }

  async updateMembersState(
    memberId: number,
    registDate: string,
    period: number,
    userId: number,
  ): Promise<void> {
    const member = await this.getMemberById(memberId, userId);

    if (member.state === MemberState.NORMAL) {
      throw new BadRequestException(
        '"Normal" is not suitable for this functionality',
      );
    }

    if (member.state === MemberState.PT) {
      await this.update({ id: memberId, userId }, { registDate, period });
      return;
    }
    await this.update(
      { id: memberId },
      { registDate, state: MemberState.NORMAL, period },
    );
  }

  async deleteMember(id: number) {
    await this.softDelete({ id });
  }
}
