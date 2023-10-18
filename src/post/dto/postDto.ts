import { IsNotEmpty, IsString } from 'class-validator';

export namespace PostDTO {
  export class CreatePost {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;
  }

  export class UpdatePost {
    @IsNotEmpty()
    @IsString()
    readonly title?: string;

    @IsNotEmpty()
    @IsString()
    readonly content?: string;
  }

  export class DeletePost {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
  }
}
