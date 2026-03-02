import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { KosService } from './kos.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('kos')
export class KosController {
  constructor(private readonly kosService: KosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.owner)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './uploads/kos',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateKosDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    const images = files?.map((f) => f.filename);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.kosService.create(dto, images, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.owner)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './uploads/kos',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: UpdateKosDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    const images = files?.map((f) => f.filename);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.kosService.update(+id, dto, images, req.user.id);
  }

  @Get()
  findAll(@Query('gender') gender?: 'male' | 'female' | 'all') {
    return this.kosService.findAll(gender);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kosService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.owner)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.kosService.remove(+id, req.user.id);
  }
}
