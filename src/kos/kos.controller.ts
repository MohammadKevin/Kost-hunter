import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseEnumPipe,
  Req,
} from '@nestjs/common';

import { KosService } from './kos.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import { multerConfig } from './multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Gender } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('kos')
export class KosController {
  constructor(private readonly kosService: KosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Roles('OWNER')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  create(
    @Body() dto: CreateKosDto,
    @Req() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.kosService.create(dto, req.user.id, file);
  }

  @Get()
  findAll() {
    return this.kosService.findAll();
  }

  @Get('filter/:gender')
  filter(@Param('gender', new ParseEnumPipe(Gender)) gender: Gender) {
    return this.kosService.findByGender(gender);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Roles('OWNER')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateKosDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.kosService.update(Number(id), dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Roles('OWNER')
  remove(@Param('id') id: string) {
    return this.kosService.remove(Number(id));
  }
}
