import { Logger, Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberReppository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PT } from './entities/pt.entity';
import { Member } from './entities/member.entity';
import { MemberScheduleService } from './member.schedule.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([PT, Member]), ScheduleModule.forRoot()],
  controllers: [MemberController],
  providers: [MemberService, MemberReppository, Logger, MemberScheduleService],
})
export class MemberModule {}
