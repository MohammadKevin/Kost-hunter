import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Status } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookDto) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: dto.kosId },
    });

    if (!kos) {
      throw new NotFoundException('Kos tidak ditemukan');
    }

    return this.prisma.book.create({
      data: {
        kosId: dto.kosId,
        userId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  findMyBookings(userId: number) {
    return this.prisma.book.findMany({
      where: { userId },
      include: { kos: true },
      orderBy: { id: 'desc' },
    });
  }

  async updateStatus(bookId: number, status: Status, ownerId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: { kos: true },
    });

    if (!book) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (book.kos.userId !== ownerId) {
      throw new ForbiddenException('Bukan kos kamu');
    }

    return this.prisma.book.update({
      where: { id: bookId },
      data: { status },
    });
  }

  history(ownerId: number, month?: number, year?: number) {
    const start = month && year ? new Date(year, month - 1, 1) : undefined;
    const end =
      month && year ? new Date(year, month, 0, 23, 59, 59) : undefined;

    return this.prisma.book.findMany({
      where: {
        kos: { userId: ownerId },
        ...(start && end
          ? {
              startDate: {
                gte: start,
                lte: end,
              },
            }
          : {}),
      },
      include: {
        kos: true,
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async generateInvoice(bookId: number, userId: number, res: Response) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: {
        kos: true,
        user: true,
      },
    });

    if (!book) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (book.userId !== userId) {
      throw new ForbiddenException('Bukan booking kamu');
    }

    if (book.status !== Status.accept) {
      throw new ForbiddenException('Booking belum diterima');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.header('Content-Type', 'application/pdf');
    res.header(
      'Content-Disposition',
      `attachment; filename=nota-booking-${book.id}.pdf`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.pipe(res);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.fontSize(18).text('BUKTI PEMESANAN KOS', { align: 'center' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.moveDown();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.fontSize(12);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`ID Booking      : ${book.id}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Nama Pemesan    : ${book.user.name}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Nama Kos        : ${book.kos.name}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Alamat Kos      : ${book.kos.address}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Harga / Bulan   : Rp ${book.kos.pricePerMonth}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Tanggal Mulai   : ${book.startDate.toDateString()}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Tanggal Selesai : ${book.endDate.toDateString()}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text(`Status          : ${book.status}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.moveDown();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.text('Terima kasih telah menggunakan Kos Hunter', {
      align: 'center',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    doc.end();
  }
}
