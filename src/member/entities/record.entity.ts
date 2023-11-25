import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Excercise } from './excercise.entity';
import { PT } from './pt.entity';
import { Member } from './member.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Entity()
export class Record extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  trainerId: number;

  @Column()
  ptId: number;

  @Column()
  traningDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Excercise, (excercise) => excercise.record)
  excerisies: Excercise[];

  @ManyToOne(() => PT, (pt) => pt.records)
  @JoinColumn({ name: 'ptId' })
  pt: PT;

  @ManyToOne(() => Member, (member) => member.records)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @ManyToOne(() => Staff, (staff) => staff.records)
  @JoinColumn({ name: 'trainerId' })
  staff: Staff;
}
