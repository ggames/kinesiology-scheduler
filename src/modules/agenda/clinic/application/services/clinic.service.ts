import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../../domain/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic) private readonly repo: Repository<Clinic>,
  ) {}

  findAll(): Promise<Clinic[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Clinic> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Clinic not found');
    return entity;
  }

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: Partial<CreateClinicDto>): Promise<Clinic> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
