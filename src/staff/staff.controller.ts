import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDTO } from './dto/staff.dto';
import { AuthGuard } from '@nestjs/passport';
import { Staff } from './entities/staff.entity';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async registStaff(
    @Body(ValidationPipe) staffDTO: StaffDTO.create,
    @Req() req: any,
  ) {
    await this.staffService.registStaff(staffDTO, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllStaff(
    @Query('gender') gender: string,
    @Req() req: any,
  ): Promise<Staff[]> {
    console.log(gender);
    return await this.staffService.getAllStaff(req.user.id, gender);
  }
}
