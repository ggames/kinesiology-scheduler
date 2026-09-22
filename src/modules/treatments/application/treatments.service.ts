import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from '../domain/treatment.entity';
import { CreateTreatmentDto } from './dto/create-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectRepository(Treatment)
    private repo: Repository<Treatment>,
  ) {}

  async create(dto: CreateTreatmentDto): Promise<Treatment> {
    const entity = this.repo.create({
      patient: { id: dto.patientId },
      prescribingProfessional: { id: dto.professionalId },
      description: dto.description,
      totalSessions: dto.totalSessions,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<Treatment[]> {
    return this.repo.find({ relations: { patient: true, prescribingProfessional: true } });
  }
}
