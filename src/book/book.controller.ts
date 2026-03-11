import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { BookService } from './book.service';
import { PdfService } from './pdf.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Menambahkan Booking' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIETY')
  create(@Req() req: Request, @Body() dto: CreateBookDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = (req as any).user;

    return this.bookService.create({
      ...dto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Melihat semua booking' })
  findAll() {
    return this.bookService.findAll();
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Update status booking' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookStatusDto) {
    return this.bookService.updateStatus(Number(id), dto.status);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Melihat history booking berdasarkan bulan dan tahun',
  })
  history(@Query('month') month: string, @Query('year') year: string) {
    if (!month || !year) {
      throw new BadRequestException('Bulan dan Tahun wajib diisi');
    }

    return this.bookService.findByMonth(Number(month), Number(year));
  }

  @Get('nota/:id')
  @ApiOperation({ summary: 'Mencetak nota PDF berdasarkan id booking' })
  async generate(@Param('id') id: string, @Res() res: Response) {
    const booking = await this.bookService.findById(Number(id));

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    return this.pdfService.generate(res, booking);
  }
}
