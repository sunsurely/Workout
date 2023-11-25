import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export namespace AuthDto {
  export class CreateUser {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly nickname: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
    readonly password: string;
  }
}
