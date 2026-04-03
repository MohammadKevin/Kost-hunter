import { IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  kos_id!: number;

  @IsString()
  comment!: string;
}
