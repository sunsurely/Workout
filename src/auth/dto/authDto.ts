import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export namespace AuthDTO {
  export class Signup {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;
  }

  export class Signin {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;
  }
}
