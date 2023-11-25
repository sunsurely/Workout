import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/common/types';

export interface Excercise {
  part: string;
  excercise: string;
  set: number;
}

export namespace MemberDTO {
  export class CreateMember {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    readonly name: string;

    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsEnum(Gender)
    readonly gender: Gender;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    readonly birth: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    readonly registDate: string;

    @Matches(/^\d{3}-\d{4}-\d{4}$/)
    readonly phoneNumber: string;

    @IsNumber()
    readonly period: number;
  }

  export class CreatePT {
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    readonly registDate: string;

    @IsNumber()
    counting: number;

    @IsNumber()
    amounts: number;
  }

  export class CreateRecord {
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    readonly trainingDate: string;

    @IsArray()
    readonly exerciseArr: Excercise[];
  }
}
