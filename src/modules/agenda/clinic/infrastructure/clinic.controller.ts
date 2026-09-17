import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ClinicService } from '../application/services/clinic.service';
import { CreateClinicDto, UpdateClinicDto } from '../application/dto/create-clinic.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Clinic')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('clinic')
export class ClinicController {
  constructor(private readonly service: ClinicService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiBody({ type: CreateClinicDto })
  create(@Body() dto: CreateClinicDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a clinic' })
  @ApiBody({ type: UpdateClinicDto })
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinic' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
