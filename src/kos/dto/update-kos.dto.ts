import { IsOptional, IsString, IsEnum } from 'class-validator';
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
  pricePerMonth?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
