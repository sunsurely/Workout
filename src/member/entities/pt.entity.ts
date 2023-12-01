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

import { Member } from './member.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Entity()
export class PT extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  trainerId: number;

  @Column()
  registDate: string;

  @Column()
  counting: number;

  @Column()
  amounts: number;

  @Column({ type: 'boolean', default: false })
  expired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Member, (member) => member.pts)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @ManyToOne(() => Staff, (staff) => staff.pts)
  @JoinColumn({ name: 'trainerId' })
  staff: Staff;
}
