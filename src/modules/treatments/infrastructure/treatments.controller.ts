import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { TreatmentsService } from '../application/treatments.service';
import { CreateTreatmentDto } from '../application/dto/create-treatment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Treatments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly service: TreatmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new treatment order' })
  @ApiBody({ type: CreateTreatmentDto })
  create(@Body() dto: CreateTreatmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all treatments' })
  findAll() {
    return this.service.findAll();
  }
}
