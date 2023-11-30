import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { StaffDTO } from './dto/staff.dto';
import { Gender } from 'src/common/types';

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

  async getAllStaff(userId: number, genderString: string): Promise<Staff[]> {
    if (genderString === '전체') {
      return this.find({ where: { userId } });
    } else if (genderString === '남성') {
      return this.find({ where: { userId, gender: Gender.MALE } });
    } else {
      return this.find({ where: { userId, gender: Gender.FEMALE } });
    }
  }

  async findStaffByPhoneNumber(phoneNumber): Promise<Staff> {
    return this.findOne({ where: { phoneNumber } });
  }
}
