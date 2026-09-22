import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklySchedule } from '../../domain/weekly-schedule.entity';
import { CreateWeeklyScheduleDto } from '../dto/create-weekly-schedule.dto';

@Injectable()
export class WeeklyScheduleService {
  constructor(
    @InjectRepository(WeeklySchedule)
    private readonly repo: Repository<WeeklySchedule>,
  ) {}

  findAll(): Promise<WeeklySchedule[]> {
    return this.repo.find({ order: { dayOfWeek: 'ASC' } });
  }

  async findOne(id: string): Promise<WeeklySchedule> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('WeeklySchedule not found');
    return entity;
  }

  async create(dto: CreateWeeklyScheduleDto): Promise<WeeklySchedule> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    dto: Partial<CreateWeeklyScheduleDto>,
  ): Promise<WeeklySchedule> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async saveBulk(dtos: CreateWeeklyScheduleDto[]): Promise<WeeklySchedule[]> {
    const results: WeeklySchedule[] = [];
    for (const dto of dtos) {
      const existing = await this.repo.findOne({ where: { dayOfWeek: dto.dayOfWeek } });
      if (existing) {
        await this.repo.update(existing.id, dto);
        const updated = await this.findOne(existing.id);
        results.push(updated);
      } else {
        const created = await this.create(dto);
        results.push(created);
      }
    }
    return results;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
