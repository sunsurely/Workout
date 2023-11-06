import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record, Status } from './entity/record.entity';
import { Repository } from 'typeorm';
import { RecordDTO } from './dto/recordDto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Excercise } from './entity/excercise.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(Excercise)
    private readonly excerRepository: Repository<Excercise>,
  ) {}

  async createRecord(recordDto: RecordDTO.CreateRecord, userId) {
    const { title, excercise, part } = recordDto;
    let { status } = recordDto;
    if (status !== Status.INCOMPLET) {
      status = 'incomplet';
    }
    const newRecord = await this.recordRepository.create({
      title,
      part,
      status,
      userId,
    });

    excercise.map(async (item) => {
      const newExcercise = await this.excerRepository.create({
        excercise: item.exercise,
        set: item.set,
      });

      await this.excerRepository.save(newExcercise);
    });

    return await this.recordRepository.save(newRecord);
  }

  async readRecords(id: number) {
    return await this.recordRepository.find({ where: { userId: id } });
  }

  async readRecordById(id: number) {
    return await this.recordRepository.findOne({ where: { id } });
  }

  async updateRecord(recordDto: RecordDTO.UpdateRecord, id) {
    return await this.recordRepository.update(id, recordDto);
  }

  async deleteRecord(recordDto: RecordDTO.DeleteRecord, id, user: User) {
    const { password } = recordDto;

    const comparedPassword = bcrypt.compareSync(password, user.password);
    if (!comparedPassword) {
      throw new NotAcceptableException('비밀번호가 일치 하지 않습니다.');
    }

    return this.recordRepository.delete(id);
  }
}
