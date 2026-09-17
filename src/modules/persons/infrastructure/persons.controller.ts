import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PersonsService } from '../application/persons.service';
import { CreatePersonDto, UpdatePersonDto } from '../application/dto/create-person.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Persons')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('persons')
export class PersonsController {
  constructor(private readonly service: PersonsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiBody({ type: CreatePersonDto })
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all persons' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get person by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a person' })
  @ApiBody({ type: UpdatePersonDto })
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a person' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
