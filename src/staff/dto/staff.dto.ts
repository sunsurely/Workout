import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from 'src/common/types';

export namespace StaffDTO {
  export class create {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(10)
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;

    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsEnum(Gender)
    readonly gender: Gender;

    @IsString()
    readonly birth: string;
  }
}
