import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberReppository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PT } from './entities/pt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PT])],
  controllers: [MemberController],
  providers: [MemberService, MemberReppository],
})
export class MemberModule {}
