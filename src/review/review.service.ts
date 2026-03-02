import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(kosId: number, comment: string, userId: number) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: kosId },
    });

    if (!kos) {
      throw new NotFoundException('Kos tidak ditemukan');
    }

    return this.prisma.review.create({
      data: {
        kosId,
        comment,
        userId,
      },
    });
  }

  findByKos(kosId: number) {
    return this.prisma.review.findMany({
      where: { kosId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async reply(reviewId: number, reply: string, ownerId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { kos: true },
    });

    if (!review || review.kos.userId !== ownerId) {
      throw new ForbiddenException('Bukan kos kamu');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { reply },
    });
  }
}
