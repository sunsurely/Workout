import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberReppository } from './member.repository';
import { MemberDTO } from './dto/member.dto';
import { DataSource, Repository } from 'typeorm';
import { Member, MemberState } from './entities/member.entity';
import { PT } from './entities/pt.entity';
import { AllMember } from './types/member.types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberReppository,
    private dataSource: DataSource,
    @InjectRepository(PT)
    private readonly ptRepository: Repository<PT>,
  ) {}

  async registMember(
    userId: number,
    memberDto: MemberDTO.CreateMember,
  ): Promise<void> {
    const existMember = await this.memberRepository.getMemberByPhoneNumber(
      memberDto.phoneNumber,
      userId,
    );

    if (existMember) {
      throw new ConflictException('Existing Member');
    }

    await this.memberRepository.createMember(userId, memberDto);
  }

  async getAllMembersById(
    userId: number,
    gender: string,
    state: string,
  ): Promise<AllMember[]> {
    const members = await this.memberRepository.getAllMembers(
      userId,
      state,
      gender,
    );

    const memberResult = members.map((member) => {
      const { pts, ...rest } = member;
      return {
        ...rest,

        amounts: pts.length >= 1 && pts[0].staff ? pts[0].amounts : 0,
        trainerName: pts.length >= 1 && pts[0].staff ? pts[0].staff.name : '-',
      };
    });

    return memberResult;
  }

  async getMembersByName(userId: number, name: string) {
    const members = await this.memberRepository.getMembersByName(userId, name);
    if (!members || members.length <= 0) {
      throw new NotFoundException('Not found members');
    }

    const membersResult = members.map((member) => {
      if (member.pts.length >= 1) {
        const { pts, ...rest } = member;
        return {
          ...rest,
          amounts: member.pts[0].amounts,
          trainerName: member.pts[0].staff.name,
        };
      }
      return { ...member, amounts: 0, trainerName: '-' };
    });

    return membersResult;
  }

  async getMemberByPhoneNumber(phoneNumber: string, userId: number) {
    const member = await this.memberRepository.getMemberByPhoneNumber(
      phoneNumber,
      userId,
    );

    if (!member) {
      throw new NotFoundException('Not found member.');
    }

    if (member.pts.length >= 1) {
      const { pts, ...rest } = member;

      const result = {
        ...rest,
        amounts: pts[0].amounts,
        trainerName: pts[0].staff.name,
      };
      return result;
    }

    return { ...member, amounts: 0, trainerName: '-' };
  }

  async getMemberById(memberId: number) {
    const member = await this.memberRepository.getMemberById(memberId);

    if (!member) {
      throw new NotFoundException('Not found member.');
    }

    if (member.pts.length >= 1 && member.pts[0].staff) {
      const { pts, ...rest } = member;

      const result = {
        ...rest,
        amounts: pts[0].amounts,
        trainerName: pts[0].staff.name,
        counting: pts[0].counting,
        ptExpired: pts[0].expired,
        ptRegistDate: pts[0].registDate,
        ptId: pts[0].id,
      };
      return result;
    }

    return {
      ...member,
      amounts: 0,
      trainerName: '-',
      counting: '-',
      ptExpired: '-',
      ptRegistDate: '-',
    };
  }

  async registPT(
    staffId: number,
    memberId: number,
    memberDTO: MemberDTO.CreatePT,
  ) {
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

  async updateMembersState(
    memberId: number,
    registDate: string,
    period: number,
    userId: number,
  ): Promise<void> {
    await this.memberRepository.updateMembersState(
      memberId,
      registDate,
      period,
    );
  }

  async updatePTCounting(
    memberId: number,
    ptId: number,
    counting,
    expirationdate,
  ) {
    const newDate = new Date();
    const today = newDate.toISOString().split('T')[0];

    const member = await this.getMemberById(memberId);
    const pt = await this.ptRepository.findOne({
      where: { id: ptId, memberId },
    });
    pt.counting = counting;

    if (counting === 0) {
      await this.memberRepository.updateMemberRegistState(
        memberId,
        MemberState.NORMAL,
      );

      pt.expired = true;
    }

    if (today === expirationdate) {
      member.state = MemberState.EXPIRED;
      await this.memberRepository.save(member);
    }

    await this.ptRepository.save(pt);
  }
}
