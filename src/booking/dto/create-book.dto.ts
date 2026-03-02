import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsNumber()
  kosId!: number;

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endDate!: string;
}
