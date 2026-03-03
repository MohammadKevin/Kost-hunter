import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import express from 'express';
import { BookingService } from './booking.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('society')
  @Post()
  create(@Req() req, @Body() dto: CreateBookDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.bookingService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('society')
  @Get('my')
  findMyBookings(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.bookingService.findMyBookings(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Put(':id/status')
  updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateBookStatusDto,
  ) {
    return this.bookingService.updateStatus(
      Number(id),
      dto.status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get('history')
  history(
    @Req() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.bookingService.history(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('society')
  @Get(':id/invoice')
  invoice(@Req() req, @Param('id') id: string, @Res() res: express.Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.bookingService.generateInvoice(Number(id), req.user.id, res);
  }
}
