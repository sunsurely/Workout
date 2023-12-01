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

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:memberId/pt/:ptId/:counting')
  async updatePTCounting(
    @Param('memberId', new ParseIntPipe()) memberId: number,
    @Param('ptId', new ParseIntPipe()) ptId: number,
    @Param('counting', new ParseIntPipe()) counting: number,
  ) {
    await this.memberService.updatePTCounting(memberId, ptId, counting);
  }
}
