import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async addFacility(kosId: number, dto: CreateFacilityDto) {
    const facilities = (dto.facility ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);

    await this.prisma.kosFacility.createMany({
      data: facilities.map((f) => ({
        kos_id: kosId,
        facility: f,
      })),
    });

    // ambil data setelah insert
    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
      select: {
        id: true,
        kos_id: true,
        facility: true,
      },
    });
  }

  getFacilities(kosId: number) {
    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
      select: {
        id: true,
        kos_id: true,
        facility: true,
      },
    });
  }

  async updateFacilities(kosId: number, dto: CreateFacilityDto) {
    await this.prisma.kosFacility.deleteMany({
      where: { kos_id: kosId },
    });

    const facilities = (dto.facility ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);

    await this.prisma.kosFacility.createMany({
      data: facilities.map((f) => ({
        kos_id: kosId,
        facility: f,
      })),
    });

    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
      select: {
        id: true,
        kos_id: true,
        facility: true,
      },
    });
  }
}
