import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from '../../domain/holiday.entity';
import { CreateHolidayDto } from '../dto/create-holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday) private readonly repo: Repository<Holiday>,
  ) {}

  findAll(): Promise<Holiday[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Holiday> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Holiday not found');
    return entity;
  }

  async create(dto: CreateHolidayDto): Promise<Holiday> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: Partial<CreateHolidayDto>): Promise<Holiday> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
