import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WeeklyScheduleService } from '../application/services/weekly-schedule.service';
import { CreateWeeklyScheduleDto, UpdateWeeklyScheduleDto } from '../application/dto/create-weekly-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Public } from '../../../../core/auth/decorators/public.decorator';

@ApiTags('Weekly Schedule')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('weekly-schedule')
export class WeeklyScheduleController {
  constructor(private readonly service: WeeklyScheduleService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all weekly schedules' })
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Post('bulk')
  @ApiOperation({ summary: 'Create or update weekly schedules in bulk' })
  @ApiBody({ type: [CreateWeeklyScheduleDto] })
  saveBulkPost(@Body() dtos: CreateWeeklyScheduleDto[]) {
    return this.service.saveBulk(dtos);
  }

  @Public()
  @Put('bulk')
  @ApiOperation({ summary: 'Create or update weekly schedules in bulk' })
  @ApiBody({ type: [CreateWeeklyScheduleDto] })
  saveBulkPut(@Body() dtos: CreateWeeklyScheduleDto[]) {
    return this.service.saveBulk(dtos);
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
