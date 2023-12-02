import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, MemberState } from './entities/member.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MemberScheduleService {
  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkExpiresMemberState() {
    const currentDate = new Date();
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.state=:state', { state: MemberState.NORMAL })
      .andWhere(
        'DATE_ADD(member.registDate, INTERVAL member.period MONTH)<= :currentDate',
        {
          currentDate,
        },
      )
      .getMany();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      for (const member of members) {
        await queryRunner.manager.update(
          Member,
          { id: member.id },
          { state: MemberState.EXPIRED },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.debug('만료된 회원들의 상태를 변경했습니다.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.logger.debug('만료된 회원들의 상태변경 실패');
    } finally {
      await queryRunner.release();
    }
  }
}
