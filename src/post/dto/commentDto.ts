import { IsNotEmpty, IsString } from 'class-validator';

export namespace CommentDTO {
  export class CreatePost {
    @IsNotEmpty()
    @IsString()
    readonly comment: string;
  }

  export class UpdateComment {
    @IsNotEmpty()
    @IsString()
    readonly comment?: string;
  }

  export class DeleteComment {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
  }
}
