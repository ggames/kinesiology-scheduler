import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ProfessionalsService } from '../application/professionals.service';
import { CreateProfessionalDto } from '../application/dto/create-professional.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Professionals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly service: ProfessionalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new professional' })
  @ApiBody({ type: CreateProfessionalDto })
  create(@Body() dto: CreateProfessionalDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all professionals' })
  findAll() {
    return this.service.findAll();
  }
}
