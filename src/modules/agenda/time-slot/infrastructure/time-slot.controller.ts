import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { TimeSlotService } from '../application/services/time-slot.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from '../application/dto/create-time-slot.dto';
import { UpdateTimeSlotCapacityDto } from '../application/dto/update-time-slot-capacity.dto';
import { JwtAuthGuard } from '../../../../core/auth/guards/jwt-auth.guard';
import { Public } from '../../../../core/auth/decorators/public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Time Slot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly service: TimeSlotService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all time slots (with optional date and professionalId filtering)' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'professionalId', required: false, description: 'Professional UUID' })
  findAll(@Query('date') date?: string, @Query('professionalId') professionalId?: string) {
    if (date) {
      return this.service.findByDate(date, professionalId);
    }
    return this.service.findAll(date, professionalId);
  }

  @Public()
  @Get('by-date')
  @ApiOperation({ summary: 'Obtener únicamente los slots reales cargados para una fecha específica (YYYY-MM-DD)' })
  @ApiQuery({ name: 'date', required: true, description: 'Fecha en formato YYYY-MM-DD' })
  @ApiQuery({ name: 'professionalId', required: false, description: 'ID de profesional (opcional)' })
  findByDate(@Query('date') date: string, @Query('professionalId') professionalId?: string) {
    return this.service.findByDate(date, professionalId);
  }

  @Public()
  @Get('/slots')
  @Get('/api/slots')
  @ApiOperation({ summary: 'Alias para obtener slots por fecha (/slots o /api/slots)' })
  findSlotsAlias(@Query('date') date: string, @Query('professionalId') professionalId?: string) {
    return this.service.findByDate(date, professionalId);
  }

  @Public()
  @Patch('capacity/global')
  @Put('capacity/global')
  @ApiOperation({ summary: 'Update maximum capacity (N) globally for all time slots in all agendas' })
  @ApiBody({ type: UpdateTimeSlotCapacityDto })
  updateGlobalCapacity(@Body() dto: UpdateTimeSlotCapacityDto) {
    return this.service.updateAllSlotsCapacity(dto.maxCapacity);
  }

  @Public()
  @Patch('agenda/:agendaId/capacity')
  @Put('agenda/:agendaId/capacity')
  @ApiOperation({ summary: 'Update maximum capacity (N) for all slots in a daily agenda' })
  @ApiBody({ type: UpdateTimeSlotCapacityDto })
  updateAgendaCapacity(@Param('agendaId') agendaId: string, @Body() dto: UpdateTimeSlotCapacityDto) {
    return this.service.updateAgendaSlotsCapacity(agendaId, dto.maxCapacity);
  }

  @Public()
  @Patch(':id/capacity')
  @Put(':id/capacity')
  @ApiOperation({ summary: 'Update maximum capacity (N) for a specific time slot' })
  @ApiBody({ type: UpdateTimeSlotCapacityDto })
  updateCapacity(@Param('id') id: string, @Body() dto: UpdateTimeSlotCapacityDto) {
    return this.service.update(id, { maxCapacity: dto.maxCapacity });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get time slot by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new time slot' })
  @ApiBody({ type: CreateTimeSlotDto })
  create(@Body() dto: CreateTimeSlotDto) {
    return this.service.create(dto);
  }

  @Public()
  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a time slot' })
  @ApiBody({ type: UpdateTimeSlotDto })
  update(@Param('id') id: string, @Body() dto: UpdateTimeSlotDto) {
    return this.service.update(id, dto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time slot' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

