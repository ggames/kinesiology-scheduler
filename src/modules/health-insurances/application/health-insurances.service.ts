import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthInsurance } from '../domain/health-insurance.entity';
import { CreateHealthInsuranceDto } from './dto/create-health-insurance.dto';

@Injectable()
export class HealthInsurancesService {
  constructor(
    @InjectRepository(HealthInsurance)
    private repo: Repository<HealthInsurance>,
  ) {}

  async create(dto: CreateHealthInsuranceDto): Promise<HealthInsurance> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<HealthInsurance[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<HealthInsurance> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`HealthInsurance #${id} not found`);
    return entity;
  }
}
