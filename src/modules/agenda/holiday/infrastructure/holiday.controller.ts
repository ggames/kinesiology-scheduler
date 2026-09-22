import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { HolidayService } from '../application/services/holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../application/dto/create-holiday.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Public } from '../../../../core/auth/decorators/public.decorator';

@ApiTags('Holiday')
@Controller('holiday')
export class HolidayController {
  constructor(private readonly service: HolidayService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all holidays (public)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get holiday by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new holiday' })
  @ApiBody({ type: CreateHolidayDto })
  create(@Body() dto: CreateHolidayDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a holiday' })
  @ApiBody({ type: UpdateHolidayDto })
  update(@Param('id') id: string, @Body() dto: UpdateHolidayDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a holiday' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
