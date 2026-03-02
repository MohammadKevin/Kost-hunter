import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKosDto, images: string[], userId: number) {
    return this.prisma.kos.create({
      data: {
        name: dto.name,
        address: dto.address,
        pricePerMonth: dto.pricePerMonth,
        gender: dto.gender,
        userId,

        images: images?.length
          ? {
              create: images.map((file) => ({ file })),
            }
          : undefined,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateKosDto,
    images: string[],
    userId: number,
  ) {
    const kos = await this.prisma.kos.findUnique({
      where: { id },
    });

    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.userId !== userId) throw new ForbiddenException('Not your kos');

    return this.prisma.kos.update({
      where: { id },
      data: {
        ...dto,
        images: images?.length
          ? {
              deleteMany: {},
              create: images.map((file) => ({ file })),
            }
          : undefined,
      },
    });
  }

  async findAll(gender?: 'male' | 'female' | 'all') {
    return this.prisma.kos.findMany({
      where: gender && gender !== 'all' ? { gender } : undefined,
      include: {
        images: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.kos.findUnique({
      where: { id },
      include: {
        images: true,
        facilities: true,
        reviews: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const kos = await this.prisma.kos.findUnique({
      where: { id },
    });

    if (!kos) {
      throw new NotFoundException('Kos not found');
    }

    if (kos.userId !== userId) {
      throw new ForbiddenException('Not your kos');
    }

    await this.prisma.kosImage.deleteMany({
      where: { kosId: id },
    });

    await this.prisma.kosFacility.deleteMany({
      where: { kosId: id },
    });

    await this.prisma.review.deleteMany({
      where: { kosId: id },
    });

    await this.prisma.book.deleteMany({
      where: { kosId: id },
    });

    return this.prisma.kos.delete({
      where: { id },
    });
  }
}
