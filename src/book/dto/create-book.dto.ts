import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

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
