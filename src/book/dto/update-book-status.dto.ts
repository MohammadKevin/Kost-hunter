import { IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
