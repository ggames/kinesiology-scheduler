import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthInsurance } from '../domain/health-insurance.entity';
import { CreateHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { UpdateHealthInsuranceDto } from './dto/update-health-insurance.dto';

@Injectable()
export class HealthInsurancesService {
  constructor(
    @InjectRepository(HealthInsurance)
    private repo: Repository<HealthInsurance>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    try {
      const count = await this.repo.count();
      if (count === 0) {
        const defaultNames = [
          'Particular / Sin Obra Social',
          'OSDE',
          'Swiss Medical',
          'Galeno',
          'PAMI',
          'IOMA',
          'Medifé',
          'Omint',
          'OSECAC',
          'OSPE',
        ];
        const entities = defaultNames.map((name) => this.repo.create({ name }));
        await this.repo.save(entities);
      }
    } catch (err) {
      console.warn('Could not seed health insurances:', err);
    }
  }

  async create(dto: CreateHealthInsuranceDto): Promise<HealthInsurance> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<HealthInsurance[]> {
    return this.repo.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<HealthInsurance> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`HealthInsurance #${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateHealthInsuranceDto): Promise<HealthInsurance> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }
}
