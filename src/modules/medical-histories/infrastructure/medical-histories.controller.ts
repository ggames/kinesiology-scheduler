import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MedicalHistoriesService } from '../application/medical-histories.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from '../application/dto/create-medical-history.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Medical Histories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('medical-histories')
export class MedicalHistoriesController {
  constructor(private readonly service: MedicalHistoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medical history record' })
  @ApiBody({ type: CreateMedicalHistoryDto })
  create(@Body() dto: CreateMedicalHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medical history records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medical history record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical history record by patient ID' })
  findByPatientId(@Param('patientId') patientId: string) {
    return this.service.findByPatientId(patientId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a medical history record' })
  @ApiBody({ type: UpdateMedicalHistoryDto })
  update(@Param('id') id: string, @Body() dto: UpdateMedicalHistoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medical history record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
