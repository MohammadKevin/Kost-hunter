import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFacilityDto {
  @IsNotEmpty()
  @IsNumber()
  kosId!: number;

  @IsNotEmpty()
  @IsString()
  facility!: string;
}
