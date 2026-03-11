import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-reviw.dto';
import { ReplyReviewDto } from './dto/reply-reviw.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        kos_id: dto.kos_id,
        user_id: userId,
        comment: dto.comment,
      },
    });
  }

  reply(reviewId: number, dto: ReplyReviewDto) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        reply: dto.reply,
      },
    });
  }

  findByKos(kosId: number) {
    return this.prisma.review.findMany({
      where: { kos_id: kosId },
      include: {
        user: true,
      },
    });
  }
}
