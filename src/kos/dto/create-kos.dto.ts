import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
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
  @Type(() => Number) // 🔥 INI KUNCINYA
  pricePerMonth!: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;
}
