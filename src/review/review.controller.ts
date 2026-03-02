import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('society')
  @Post()
  create(@Req() req, @Body() dto: CreateReviewDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.reviewService.create(dto.kosId, dto.comment, req.user.id);
  }

  @Get('kos/:kosId')
  findByKos(@Param('kosId') kosId: string) {
    return this.reviewService.findByKos(+kosId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Put(':id/reply')
  reply(@Req() req, @Param('id') id: string, @Body() dto: ReplyReviewDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.reviewService.reply(+id, dto.reply, req.user.id);
  }
}
