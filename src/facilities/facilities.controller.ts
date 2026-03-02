import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post()
  create(@Req() req, @Body() dto: CreateFacilityDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.facilitiesService.create(dto, req.user.id);
  }

  @Get('kos/:kosId')
  findByKos(@Param('kosId') kosId: string) {
    return this.facilitiesService.findByKos(Number(kosId));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.facilitiesService.remove(Number(id), req.user.id);
  }
}
