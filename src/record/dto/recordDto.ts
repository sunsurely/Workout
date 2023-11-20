import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export namespace RecordDTO {
  export class CreateRecord {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly part: string;

    @IsNotEmpty()
    @IsArray()
    readonly exercise: Array<{ exercise: string; set: number }>;

    @IsString()
    readonly status: string;
  }

  export class UpdateRecord {
    @IsString()
    readonly title?: string;

    @IsString()
    readonly part?: string;

    @IsArray()
    readonly exercise: Array<{ id: number; exercise: string; set: number }>;

    @IsString()
    readonly status?: string;
  }

  export class DeleteRecord {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
  }
}
