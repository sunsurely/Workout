import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberDTO } from './dto/member.dto';
import { Member } from './entities/member.entity';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async registMember(
    @Body() memberDTO: MemberDTO.CreateMember,
    @Req() req: any,
  ): Promise<void> {
    await this.memberService.registMember(req.user.id, memberDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pt/:staffId/:memberId')
  async registPT(
    @Body() ptDTO: MemberDTO.CreatePT,
    @Param('staffId', new ParseIntPipe()) staffId: number,
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ): Promise<void> {
    return this.memberService.registPT(staffId, memberId, ptDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pt/record/:memberId/:trainerId/:ptId')
  async createRecord(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('trainerId', new ParseIntPipe()) trainerId: number,
    @Param('ptId', new ParseIntPipe()) ptId: number,
    @Body() memberDTO: MemberDTO.CreateRecord,
  ): Promise<void> {
    await this.memberService.createRecord(memberId, trainerId, ptId, memberDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllMembersById(@Req() req: any) {
    return this.memberService.getAllMembersById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/detail')
  async getMemberById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ): Promise<Member> {
    return this.memberService.getMemberById(memberId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records')
  async getAllRecordsById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ): Promise<Member> {
    return await this.memberService.getAllRecordsByMemberId(memberId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records/trainer/:trainerId')
  async getAllRecordsByTrainerId(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('trainerId', new ParseIntPipe()) trainerId: number,
  ): Promise<Member> {
    return await this.memberService.getAllRecordsByTrainerId(
      memberId,
      trainerId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records/:recordId/detail')
  async getRecordById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('recordId', new ParseIntPipe()) recordId: number,
  ): Promise<Member> {
    return await this.memberService.getARecordById(memberId, recordId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/trainer/:trainerId/pt')
  async getPTCountingByTrainerId(
    @Param('trainerId', new ParseIntPipe()) trainerId: number,
  ): Promise<number> {
    return this.memberService.getPTCountingByTrainerId(trainerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:memberId/state')
  async updateMembersState(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Body() memberDTO: MemberDTO.UpdateState,
  ): Promise<void> {
    await this.memberService.updateMembersState(
      memberId,
      memberDTO.registDate,
      memberDTO.period,
    );
  }
}
