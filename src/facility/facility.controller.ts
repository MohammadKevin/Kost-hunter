import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post(':kosId')
  addFacility(@Param('kosId') kosId: string, @Body() dto: CreateFacilityDto) {
    return this.facilityService.addFacility(Number(kosId), dto);
  }

  @Get(':kosId')
  getFacilities(@Param('kosId') kosId: string) {
    return this.facilityService.getFacilities(Number(kosId));
  }

  @Put(':kosId')
  updateFacilities(
    @Param('kosId') kosId: string,
    @Body() dto: CreateFacilityDto,
  ) {
    return this.facilityService.updateFacilities(Number(kosId), dto);
  }
}
