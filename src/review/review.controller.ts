import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-reviw.dto';
import { ReplyReviewDto } from './dto/reply-reviw.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  @Put('reply/:id')
  @UseGuards(JwtAuthGuard)
  reply(@Param('id') id: string, @Body() dto: ReplyReviewDto) {
    return this.reviewsService.reply(Number(id), dto);
  }

  @Get('kos/:kosId')
  findByKos(@Param('kosId') kosId: string) {
    return this.reviewsService.findByKos(Number(kosId));
  }
}
