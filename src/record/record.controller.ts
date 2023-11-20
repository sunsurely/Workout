import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { AuthGuard } from '@nestjs/passport';
import { RecordDTO } from './dto/recordDto';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRecord(
    @Body() recordDto: RecordDTO.CreateRecord,
    @Req() req: any,
  ) {
    return await this.recordService.createRecord(recordDto, req.user.id);
  }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async readRecords(@Req() req: any) {
    const { id } = req.user.id;
    return this.recordService.readRecords(id);
  }

  @Get('/:recordId/detail')
  @UseGuards(AuthGuard('jwt'))
  async readRecordById(
    @Param(
      'recordId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    recordId,
  ) {
    return await this.recordService.readRecordById(recordId);
  }

  @Put('/:recordId')
  @UseGuards(AuthGuard('jwt'))
  async updateRecord(
    @Body() recordDto: RecordDTO.UpdateRecord,
    @Param(
      'recordId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    recordId,
  ) {
    return await this.recordService.updateRecord(recordDto, recordId);
  }

  @Delete('/:recordId')
  @UseGuards(AuthGuard('jwt'))
  async deleteRecord(
    @Body() deleteRecordDto: RecordDTO.DeleteRecord,
    @Param(
      'recordId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    recordId,
    @Req() req: any,
  ) {
    const user = req.user;

    return await this.recordService.deleteRecord(
      deleteRecordDto,
      recordId,
      user,
    );
  }
}
