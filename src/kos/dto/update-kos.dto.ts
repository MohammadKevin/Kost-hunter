import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class UpdateKosDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_per_month?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
