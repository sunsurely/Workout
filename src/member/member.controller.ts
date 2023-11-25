import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberDTO } from './dto/member.dto';

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
}
