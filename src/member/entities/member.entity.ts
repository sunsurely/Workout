import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Record } from './record.entity';
import { PT } from './pt.entity';
import { User } from 'src/auth/user.entity';
import { Gender } from 'src/common/types';

export enum MemberState {
  PT = 'PT',
  NORMAL = 'NORMAL',
  EXPIRED = 'EXPIRED',
}

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column()
  birth: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  registDate: string;

  @Column({ type: 'enum', enum: MemberState, default: MemberState.NORMAL })
  state: MemberState;

  @Column({ type: 'int', nullable: true })
  period: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Record, (record) => record.member)
  records: Record[];

  @OneToMany(() => PT, (pt) => pt.member)
  pts: PT[];

  @ManyToOne(() => User, (user) => user.members)
  @JoinColumn({ name: 'userId' })
  user: User;
}
