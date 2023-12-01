import { ConflictException, Injectable } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { StaffDTO } from './dto/staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async registStaff(staffDTO: StaffDTO.create, userId: number): Promise<void> {
    const existStarff = await this.staffRepository.findStaffByPhoneNumber(
      staffDTO.phoneNumber,
    );

    if (existStarff) {
      throw new ConflictException('Existing PhoneNumber');
    }

    await this.staffRepository.createStaff(staffDTO, userId);
  }

  async getAllStaff(userId: number, gender: string): Promise<Staff[]> {
    return this.staffRepository.getAllStaff(userId, gender);
  }

  async deleteStaff(userId: number, id: number) {
    return this.staffRepository.deleteStaff(userId, id);
  }
}
