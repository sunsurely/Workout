import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record, Status } from './entity/record.entity';
import { DataSource, Repository, getManager } from 'typeorm';
import { RecordDTO } from './dto/recordDto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Exercise } from './entity/exercise.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(Exercise)
    private readonly exerRepository: Repository<Exercise>,
    private readonly dataSource: DataSource,
  ) {}

  async createRecord(recordDto: RecordDTO.CreateRecord, userId) {
    const { title, exercise, part } = recordDto;
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

    await this.recordRepository.save(newRecord);

    for (const item of exercise) {
      const newExercise = await this.exerRepository.create({
        recordId: newRecord.id,
        exercise: item.exercise,
        set: item.set,
      });

      await this.exerRepository.save(newExercise);
    }

    return;
  }

  async readRecords(id: number) {
    const records = await this.recordRepository.find({ where: { id } });
    let results = [];

    for (const record of records) {
      const exercises = await this.exerRepository.find({
        where: { recordId: record.id },
      });
      results.push({ record, exercises });
    }

    return results;
  }

  async readRecordById(id: number) {
    const record = await this.recordRepository.findOne({ where: { id } });
    const exercise = await this.exerRepository.find({
      where: { recordId: record.id },
    });

    return { record, exercise };
  }

  async updateRecord(recordDto: RecordDTO.UpdateRecord, id) {
    const { title, part, status, exercise } = recordDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const record = await queryRunner.manager.findOne(Record, {
        where: { id },
      });
      if (status) record.status = status;
      if (part) record.part = part;
      if (title) record.title = title;

      await this.recordRepository.save(record);

      for (const exer of exercise) {
        const result = await queryRunner.manager.findOne(Exercise, {
          where: { id: exer.id },
        });
        result.exercise = exer.exercise;
        result.set = exer.set;
        await this.exerRepository.save(result);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
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
