import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalHistory } from '../domain/medical-history.entity';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dto/create-medical-history.dto';

@Injectable()
export class MedicalHistoriesService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly repo: Repository<MedicalHistory>,
  ) {}

  async create(dto: CreateMedicalHistoryDto): Promise<MedicalHistory> {
    const entity = this.repo.create({
      patient: { id: dto.patientId } as any,
      medicalRecordNumber: dto.medicalRecordNumber,
      diagnosis: dto.diagnosis,
      referringDoctor: dto.referringDoctor,
      medicalReferralDocument: dto.medicalReferralDocument,
      medicalHistory: dto.medicalHistory,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<MedicalHistory[]> {
    return this.repo.find({ relations: { patient: true } });
  }

  async findOne(id: string): Promise<MedicalHistory> {
    const found = await this.repo.findOne({ where: { id }, relations: { patient: true } });
    if (!found) {
      throw new NotFoundException(`Medical history ${id} not found`);
    }
    return found;
  }

  async findByPatientId(patientId: string): Promise<MedicalHistory> {
    const found = await this.repo.findOne({ where: { patient: { id: patientId } }, relations: { patient: true } });
    if (!found) {
      throw new NotFoundException(`Medical history for patient ${patientId} not found`);
    }
    return found;
  }

  async update(id: string, dto: UpdateMedicalHistoryDto): Promise<MedicalHistory> {
    const found = await this.findOne(id);
    if (dto.medicalRecordNumber !== undefined) found.medicalRecordNumber = dto.medicalRecordNumber;
    if (dto.diagnosis !== undefined) found.diagnosis = dto.diagnosis;
    if (dto.referringDoctor !== undefined) found.referringDoctor = dto.referringDoctor;
    if (dto.medicalReferralDocument !== undefined) found.medicalReferralDocument = dto.medicalReferralDocument;
    if (dto.medicalHistory !== undefined) found.medicalHistory = dto.medicalHistory;
    if (dto.patientId !== undefined) found.patient = { id: dto.patientId } as any;
    return this.repo.save(found);
  }

  async remove(id: string): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.remove(found);
  }
}
