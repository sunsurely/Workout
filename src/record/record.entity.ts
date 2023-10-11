import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Status {
  COMPLET = 'complet',
  INCOMPLET = 'incomplet',
}

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('int')
  set: number;

  @Column('varchar')
  part: string;

  @Column('varchar', { default: null })
  exercise: string;

  @Column({ type: 'enum', enum: Status })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.records)
  @JoinColumn({ name: 'userId' })
  user: User;
}
