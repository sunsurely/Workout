import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Record } from './record.entity';

@Entity()
export class Excercise extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recordId: number;

  @Column()
  part: string;

  @Column()
  excercise: string;

  @Column()
  set: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Record, (record) => record.excerisies)
  @JoinColumn({ name: 'recordId' })
  record: Record;
}
