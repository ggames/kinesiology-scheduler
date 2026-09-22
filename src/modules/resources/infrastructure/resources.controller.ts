import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ResourcesService } from '../application/resources.service';
import { CreateResourceDto } from '../application/dto/create-resource.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Resources')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiBody({ type: CreateResourceDto })
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  findAll() {
    return this.service.findAll();
  }
}
