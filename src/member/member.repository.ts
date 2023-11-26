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

  async getAllMembers(userId: number): Promise<Member[]> {
    const members = await this.createQueryBuilder('member')
      .where('member.userId = :userId', { userId })
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
        'member.period',
        'member.createdAt',
        'pt.amounts',
        'staff.name',
      ])
      .getMany();

    return members;
  }

  async getMemberById(id: number): Promise<Member> {
    const member = await this.createQueryBuilder('member')
      .where('member.id=:id', { id })
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

  async getAllRecordsByMemberId(memberId: number): Promise<Member> {
    const result = await this.createQueryBuilder('member')
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
  ): Promise<Member> {
    const result = await this.createQueryBuilder('member')
      .where('member.id="memberId', { memberId })
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

  async getRecordById(memberId: number, recordId: number): Promise<Member> {
    const record = await this.createQueryBuilder('member')
      .where('member.id=:memberId', { memberId })
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

  async getMemberByPhoneNumber(phoneNumber: string): Promise<Member> {
    return await this.findOne({ where: { phoneNumber } });
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
}
