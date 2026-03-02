import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFacilityDto, ownerId: number) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: dto.kosId },
    });

    if (!kos) {
      throw new NotFoundException('Kos tidak ditemukan');
    }

    if (kos.userId !== ownerId) {
      throw new ForbiddenException('Bukan kos kamu');
    }

    return this.prisma.kosFacility.create({
      data: {
        kosId: dto.kosId,
        facility: dto.facility,
      },
    });
  }

  findByKos(kosId: number) {
    return this.prisma.kosFacility.findMany({
      where: { kosId },
      orderBy: { id: 'asc' },
    });
  }

  async remove(id: number, ownerId: number) {
    const facility = await this.prisma.kosFacility.findUnique({
      where: { id },
      include: { kos: true },
    });

    if (!facility) {
      throw new NotFoundException('Fasilitas tidak ditemukan');
    }

    if (facility.kos.userId !== ownerId) {
      throw new ForbiddenException('Bukan kos kamu');
    }

    return this.prisma.kosFacility.delete({
      where: { id },
    });
  }
}
