import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entity/record.entity';
import { Excercise } from './entity/excercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Excercise])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
