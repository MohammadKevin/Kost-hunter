import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PdfService } from './pdf.service';

@Module({
  controllers: [BookController],
  providers: [BookService, PdfService],
})
export class BookModule {}
