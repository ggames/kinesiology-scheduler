import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WeeklyScheduleService } from '../application/services/weekly-schedule.service';
import { CreateWeeklyScheduleDto, UpdateWeeklyScheduleDto } from '../application/dto/create-weekly-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Weekly Schedule')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('weekly-schedule')
export class WeeklyScheduleController {
  constructor(private readonly service: WeeklyScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all weekly schedules' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get weekly schedule by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new weekly schedule' })
  @ApiBody({ type: CreateWeeklyScheduleDto })
  create(@Body() dto: CreateWeeklyScheduleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a weekly schedule' })
  @ApiBody({ type: UpdateWeeklyScheduleDto })
  update(@Param('id') id: string, @Body() dto: UpdateWeeklyScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weekly schedule' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
