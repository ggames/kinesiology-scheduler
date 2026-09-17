import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { HealthInsurancesService } from '../application/health-insurances.service';
import { CreateHealthInsuranceDto } from '../application/dto/create-health-insurance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Health Insurances')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('health-insurances')
export class HealthInsurancesController {
  constructor(private readonly service: HealthInsurancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create health insurance' })
  @ApiBody({ type: CreateHealthInsuranceDto })
  create(@Body() dto: CreateHealthInsuranceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all health insurances' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a health insurance by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
