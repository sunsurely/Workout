import { User } from 'src/auth/user.entity';
import { Gender } from 'src/common/types';
import { PT } from 'src/member/entities/pt.entity';
import { Record } from 'src/member/entities/record.entity';
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

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column()
  birth: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => PT, (pt) => pt.staff)
  pts: PT[];

  @OneToMany(() => Record, (record) => record.staff)
  records: Record[];

  @ManyToOne(() => User, (user) => user.staffs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
