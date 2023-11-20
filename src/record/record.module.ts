import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entity/record.entity';
import { Exercise } from './entity/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Exercise])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
