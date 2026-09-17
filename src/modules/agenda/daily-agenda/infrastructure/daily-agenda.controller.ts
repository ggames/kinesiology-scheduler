import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { DailyAgendaService } from '../application/services/daily-agenda.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Daily Agenda')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('daily-agenda')
export class DailyAgendaController {
  constructor(private readonly service: DailyAgendaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all daily agendas' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get daily agenda by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a daily agenda' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
