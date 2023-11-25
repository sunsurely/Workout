import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDTO } from './dto/staff.dto';
import { AuthGuard } from '@nestjs/passport';

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
}
