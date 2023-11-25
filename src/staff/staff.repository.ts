import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { StaffDTO } from './dto/staff.dto';

@Injectable()
export class StaffRepository extends Repository<Staff> {
  constructor(private readonly dataSource: DataSource) {
    super(Staff, dataSource.createEntityManager());
  }

  async createStaff(
    { name, phoneNumber, email, gender, birth }: StaffDTO.create,
    userId,
  ): Promise<void> {
    const newStaff = this.create({
      name,
      phoneNumber,
      email,
      gender,
      birth,
      userId,
    });
    await this.save(newStaff);
  }

  async findStaffByPhoneNumber(phoneNumber): Promise<Staff> {
    return this.findOne({ where: { phoneNumber } });
  }
}
