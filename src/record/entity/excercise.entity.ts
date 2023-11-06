import { Record } from './record.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum Status {
  COMPLET = 'complet',
  INCOMPLET = 'incomplet',
}

@Entity()
export class Excercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  recordId: number;

  @Column('varchar')
  excercise: string;

  @Column('int')
  set: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Record, (record) => record.excercisises)
  @JoinColumn({ name: 'recordId' })
  record: Record;
}
