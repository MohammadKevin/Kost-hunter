import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender, Prisma } from '@prisma/client';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import type { Express } from 'express';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateKosDto, userId: number, file?: Express.Multer.File) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.kos.create({
      data: {
        name: dto.name,
        address: dto.address,
        price_per_month: dto.price_per_month,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        gender: dto.gender,
        user_id: userId,

        images: file
          ? {
              create: {
                file: file.filename,
              },
            }
          : undefined,
      },
      include: {
        owner: true,
        images: true,
        facilities: true,
      },
    });
  }

  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.kos.findMany({
      include: {
        owner: true,
        images: true,
        facilities: true,
      },
    });
  }

  async update(id: number, dto: UpdateKosDto, file?: Express.Multer.File) {
    const data: Prisma.KosUpdateInput = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.name !== undefined) data.name = dto.name;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.price_per_month !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      data.price_per_month = dto.price_per_month;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    if (dto.gender !== undefined) data.gender = dto.gender;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.kos.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
    });

    if (file) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prisma.kosImage.deleteMany({
        where: { kos_id: id },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prisma.kosImage.create({
        data: {
          kos_id: id,
          file: file.filename,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.kos.findUnique({
      where: { id },
      include: {
        images: true,
        facilities: true,
      },
    });
  }

  remove(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.kos.delete({
      where: { id },
    });
  }

  findByGender(gender: Gender) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (gender === Gender.ALL) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return this.prisma.kos.findMany({
        include: {
          images: true,
          facilities: true,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.kos.findMany({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        OR: [{ gender }, { gender: Gender.ALL }],
      },
      include: {
        images: true,
        facilities: true,
      },
    });
  }
}
