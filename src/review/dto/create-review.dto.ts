import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  kosId!: number;

  @IsNotEmpty()
  @IsString()
  comment!: string;
}
