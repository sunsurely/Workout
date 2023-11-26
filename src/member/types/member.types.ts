import { Gender } from 'src/common/types';
import { MemberState } from '../entities/member.entity';

export interface AllMember {
  userId: number;
  name: string;
  gender: Gender;
  birth: string;
  registDate: string;
  state: MemberState;
  period: number;
  amounts: number;
  trainerName: string;
}
