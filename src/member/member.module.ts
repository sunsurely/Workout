import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberReppository } from './member.repository';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberReppository],
})
export class MemberModule {}
