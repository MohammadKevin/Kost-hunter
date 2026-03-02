import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
