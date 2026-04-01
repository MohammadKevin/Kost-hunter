/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { Response } from 'express';

interface Booking {
  id: number | string;
  start_date?: Date;
  end_date?: Date;
  status?: string;
  user?: {
    name?: string;
    email?: string;
  };
  kos?: {
    name?: string;
    price_per_month?: number;
    images?: { file: string }[];
    facilities?: { facility: string }[];
  };
}

@Injectable()
export class PdfService {
  generate(res: Response, booking: Booking) {
    const doc = new PDFDocument({
      margin: 30,
      size: [220, 600], // seperti struk thermal
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=KOSID-struk-${booking.id}.pdf`,
    );

    doc.pipe(res);

    // ===== HEADER =====
    doc.font('Courier-Bold').fontSize(14);
    doc.text('KOS.ID', { align: 'center' });

    doc.fontSize(10);
    doc.text('NOTA BOOKING KOS', { align: 'center' });

    doc.moveDown(0.5);
    doc.text('==============================', { align: 'center' });

    // ===== INFO =====
    doc.font('Courier').fontSize(9);
    doc.text(`ID   : ${booking.id}`);
    doc.text(`USER : ${booking.user?.name ?? '-'}`);
    doc.text(`EMAIL: ${booking.user?.email ?? '-'}`);

    doc.text('------------------------------');

    // ===== KOS =====
    doc.text(`KOS  : ${booking.kos?.name ?? '-'}`);
    doc.text(
      `HARGA: Rp ${booking.kos?.price_per_month?.toLocaleString() ?? '-'}`,
    );

    doc.text('------------------------------');

    // ===== FACILITY =====
    doc.text('FASILITAS:');

    const facilities = booking.kos?.facilities?.length
      ? booking.kos.facilities.map((f) => `- ${f.facility}`).join('\n')
      : '-';

    doc.text(facilities);

    doc.text('------------------------------');

    // ===== DATE =====
    doc.text(
      `START: ${booking.start_date ? new Date(booking.start_date).toLocaleDateString() : '-'}`,
    );
    doc.text(
      `END  : ${booking.end_date ? new Date(booking.end_date).toLocaleDateString() : '-'}`,
    );

    doc.text(`STATUS: ${booking.status ?? '-'}`);

    doc.text('==============================');

    // ===== FOOTER =====
    doc.text('Terima kasih 🙏', { align: 'center' });
    doc.text('Simpan struk ini sebagai bukti', { align: 'center' });

    doc.end();
  }
}
