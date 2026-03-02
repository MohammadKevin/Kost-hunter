import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyReviewDto {
  @IsNotEmpty()
  @IsString()
  reply!: string;
}
