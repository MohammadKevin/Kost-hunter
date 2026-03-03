import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class CreateKosDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pricePerMonth!: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;
}
