import { IsString } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  facility?: string;
}
