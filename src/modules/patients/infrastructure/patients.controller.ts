import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from '../application/dto/create-patient.dto';
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
}
