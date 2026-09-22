import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { HealthInsurancesService } from '../application/health-insurances.service';
import { CreateHealthInsuranceDto } from '../application/dto/create-health-insurance.dto';
import { UpdateHealthInsuranceDto } from '../application/dto/update-health-insurance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Health Insurances')
@Controller('health-insurances')
export class HealthInsurancesController {
  constructor(private readonly service: HealthInsurancesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create health insurance' })
  @ApiBody({ type: CreateHealthInsuranceDto })
  create(@Body() dto: CreateHealthInsuranceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all health insurances (public)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a health insurance by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update health insurance' })
  @ApiBody({ type: UpdateHealthInsuranceDto })
  update(@Param('id') id: string, @Body() dto: UpdateHealthInsuranceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete health insurance' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
