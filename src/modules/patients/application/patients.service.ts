import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../domain/patient.entity';
import { Person } from '../../persons/domain/person.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private repo: Repository<Patient>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    let person: Person | null = null;
    if (dto.personId) {
      person = await this.personRepo.findOne({ where: { id: dto.personId } });
    }
    if (!person && dto.documentId) {
      person = await this.personRepo.findOne({ where: { documentId: dto.documentId } });
    }
    if (!person) {
      person = this.personRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        documentId: dto.documentId,
        birthDate: dto.birthDate,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
      });
      person = await this.personRepo.save(person);
    }

    const entity = this.repo.create({
      person,
      personId: person.id,
      healthInsuranceId: dto.healthInsuranceId,
      obraSocialId: dto.obraSocialId,
      prepagaId: dto.prepagaId,
      clinicId: dto.clinicId,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<Patient[]> {
    return this.repo.find({ relations: { person: true, medicalHistory: true } });
  }

  async findOne(id: string): Promise<Patient> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { person: true, medicalHistory: true },
    });
    if (!found) {
      throw new NotFoundException(`Patient ${id} not found`);
    }
    return found;
  }
}
