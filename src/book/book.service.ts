import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.book.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        kos_id: data.kosId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        user_id: data.userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        start_date: new Date(data.startDate),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        end_date: new Date(data.endDate),
        status: BookingStatus.PENDING,
      },
      include: {
        user: true,
        kos: true,
      },
    });
  }

  findAll() {
    return this.prisma.book.findMany({
      include: {
        user: true,
        kos: {
          include: {
            images: true,
            facilities: true,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        user: true,
        kos: {
          include: {
            images: true,
            facilities: true,
          },
        },
      },
    });
  }

  updateStatus(id: number, status: BookingStatus) {
    return this.prisma.book.update({
      where: { id },
      data: { status },
    });
  }

  findByMonth(month: number, year: number) {
    return this.prisma.book.findMany({
      where: {
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        user: true,
        kos: {
          include: {
            images: true,
            facilities: true,
          },
        },
      },
    });
  }
}
