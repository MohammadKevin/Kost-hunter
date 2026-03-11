import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class CreateKosDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @Type(() => Number)
  @IsNumber()
  price_per_month!: number;

  @IsEnum(Gender)
  gender!: Gender;
}
