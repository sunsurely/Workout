import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberReppository } from './member.repository';
import { MemberDTO } from './dto/member.dto';
import { DataSource } from 'typeorm';
import { Member, MemberState } from './entities/member.entity';
import { PT } from './entities/pt.entity';
import { Record } from './entities/record.entity';
import { Excercise as recordExercise } from './dto/member.dto';
import { Excercise } from './entities/excercise.entity';
import { AllMember } from './types/member.types';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberReppository,
    private dataSource: DataSource,
  ) {}

  async registMember(
    userId: number,
    memberDto: MemberDTO.CreateMember,
  ): Promise<void> {
    const existMember = await this.memberRepository.getMemberByPhoneNumber(
      memberDto.phoneNumber,
    );

    if (existMember) {
      throw new ConflictException('Existing Member');
    }

    await this.memberRepository.createMember(userId, memberDto);
  }

  async getAllMembersById(userId: number): Promise<AllMember[]> {
    const members = await this.memberRepository.getAllMembers(userId);
    const memberResult = members.map((member) => {
      const { pts, ...rest } = member;
      return {
        ...rest,
        amounts: member.pts[0].amounts,
        trainerName: member.pts[0].staff.name,
      };
    });

    return memberResult;
  }

  async getMemberById(memberId: number): Promise<Member> {
    const member = await this.memberRepository.getMemberById(memberId);

    if (!member) {
      throw new NotFoundException('Not found member.');
    }

    return member;
  }

  async getAllRecordsByMemberId(memberId: number): Promise<Member> {
    return await this.memberRepository.getAllRecordsByMemberId(memberId);
  }

  async getAllRecordsByTrainerId(
    memberId: number,
    trainerId: number,
  ): Promise<Member> {
    return this.memberRepository.getAllRecordsByTrainerId(memberId, trainerId);
  }

  async getARecordById(memberId: number, recordId): Promise<Member> {
    return this.memberRepository.getRecordById(memberId, recordId);
  }

  async getPTCountingByTrainerId(trainerId: number): Promise<number> {
    return await this.memberRepository.getPTCountingByTrainerId(trainerId);
  }

  async registPT(staffId, memberId, memberDTO: MemberDTO.CreatePT) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const pt = queryRunner.manager.create(PT, {
        ...memberDTO,
        trainerId: staffId,
        memberId,
      });
      await queryRunner.manager.save(pt);

      await queryRunner.manager.update(
        Member,
        { id: memberId },
        { state: MemberState.PT },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createRecord(
    memberId: number,
    trainerId: number,
    ptId: number,
    memberDTO: MemberDTO.CreateRecord,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const newRecord = queryRunner.manager.create(Record, {
        memberId,
        trainerId,
        ptId,
        traningDate: memberDTO.trainingDate,
      });
      await queryRunner.manager.save(newRecord);
      const exerArr: recordExercise[] = memberDTO.exerciseArr;

      for (const arr of exerArr) {
        const exercise = queryRunner.manager.create(Excercise, {
          ...arr,
          recordId: newRecord.id,
        });
        await queryRunner.manager.save(exercise);
      }

      const pt = await queryRunner.manager.findOne(PT, { where: { id: ptId } });
      const counting = pt.counting - 1;
      await queryRunner.manager.update(PT, { id: ptId }, { counting });

      if (counting <= 0) {
        await queryRunner.manager.update(PT, { id: ptId }, { expired: true });
        //소켓 메시지처리 Or pt만료 메세지 생성
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateMembersState(
    memberId: number,
    registDate: string,
    period: number,
  ): Promise<void> {
    await this.memberRepository.updateMembersState(
      memberId,
      registDate,
      period,
    );
  }
}
