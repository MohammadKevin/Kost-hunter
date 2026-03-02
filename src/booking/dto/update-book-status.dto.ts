import { IsNotEmpty, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateBookStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status!: Status;
}
