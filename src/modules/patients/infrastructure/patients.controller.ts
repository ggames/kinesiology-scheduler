import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from '../application/dto/create-patient.dto';
import { UpdatePatientDto } from '../application/dto/update-patient.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('patients')
export class PatientsController {
  constructor(private readonly service: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiBody({ type: CreatePatientDto })
  create(@Body() dto: CreatePatientDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient data' })
  @ApiBody({ type: UpdatePatientDto })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
