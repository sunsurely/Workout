import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export namespace RecordDTO {
  export class CreateRecord {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly part: string;

    @IsNotEmpty()
    @IsString()
    readonly exercise: string;

    @IsNotEmpty()
    @IsNumber()
    readonly set: number;

    @IsString()
    readonly status: string;
  }

  export class UpdateRecord {
    @IsString()
    readonly title?: string;

    @IsString()
    readonly part?: string;

    @IsString()
    readonly exercise?: string;

    @IsNumber()
    readonly set?: number;

    @IsString()
    readonly status?: string;
  }

  export class DeleteRecord {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
  }
}
