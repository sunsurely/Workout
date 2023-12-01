import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  @Get('/name')
  async getMembersByName(@Req() req: any, @Query('name') name: string) {
    return this.memberService.getMembersByName(req.user.id, name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/phone')
  async getMemberByPhoneNumber(
    @Query('phoneNumber') phoneNumber: string,
    @Req() req: any,
  ) {
    return this.memberService.getMemberByPhoneNumber(phoneNumber, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllMembersById(
    @Req() req: any,
    @Query('gender') gender: string,
    @Query('state') state: string,
  ) {
    return this.memberService.getAllMembersById(req.user.id, gender, state);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/detail')
  async getMemberById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Req() req: any,
  ) {
    return this.memberService.getMemberById(memberId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records')
  async getAllRecordsById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Req() req: any,
  ): Promise<Member> {
    return await this.memberService.getAllRecordsByMemberId(
      memberId,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records/trainer/:trainerId')
  async getAllRecordsByTrainerId(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('trainerId', new ParseIntPipe()) trainerId: number,
    @Req() req: any,
  ): Promise<Member> {
    return await this.memberService.getAllRecordsByTrainerId(
      memberId,
      trainerId,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId/records/:recordId/detail')
  async getRecordById(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('recordId', new ParseIntPipe()) recordId: number,
    @Req() req: any,
  ): Promise<Member> {
    return await this.memberService.getARecordById(
      memberId,
      recordId,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/trainer/:trainerId/pt')
  async getPTCountingByTrainerId(
    @Param('trainerId', new ParseIntPipe()) trainerId: number,
    @Req() req: any,
  ): Promise<number> {
    return this.memberService.getPTCountingByTrainerId(trainerId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:memberId/state')
  async updateMembersState(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Body() memberDTO: MemberDTO.UpdateState,
    @Req() req: any,
  ): Promise<void> {
    await this.memberService.updateMembersState(
      memberId,
      memberDTO.registDate,
      memberDTO.period,
      req.user.id,
    );
  }
}
