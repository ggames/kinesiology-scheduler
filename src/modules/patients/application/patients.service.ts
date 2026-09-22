import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../domain/patient.entity';
import { Person } from '../../persons/domain/person.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

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

    const selectedObraId = dto.obraSocialId || dto.healthInsuranceId || undefined;

    const entity = this.repo.create({
      person,
      personId: person.id,
      healthInsuranceId: selectedObraId,
      obraSocialId: selectedObraId,
      prepagaId: dto.prepagaId,
      clinicId: dto.clinicId,
    });
    const saved = await this.repo.save(entity);
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Patient[]> {
    return this.repo.find({
      relations: {
        person: true,
        medicalHistory: true,
        obraSocial: true,
        healthInsurance: true,
        prepaga: true,
      },
    });
  }

  async findOne(id: string): Promise<Patient> {
    let found = await this.repo.findOne({
      where: { id },
      relations: {
        person: true,
        medicalHistory: true,
        obraSocial: true,
        healthInsurance: true,
        prepaga: true,
      },
    });

    if (!found) {
      found = await this.repo.findOne({
        where: { personId: id },
        relations: {
          person: true,
          medicalHistory: true,
          obraSocial: true,
          healthInsurance: true,
          prepaga: true,
        },
      });
    }

    if (!found) {
      throw new NotFoundException(`Patient ${id} not found`);
    }
    return found;
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    if (patient.person) {
      if (dto.firstName !== undefined) patient.person.firstName = dto.firstName;
      if (dto.lastName !== undefined) patient.person.lastName = dto.lastName;
      if (dto.documentId !== undefined) patient.person.documentId = dto.documentId;
      if (dto.phone !== undefined) patient.person.phone = dto.phone;
      if (dto.email !== undefined) patient.person.email = dto.email;
      if (dto.address !== undefined) patient.person.address = dto.address;
      if (dto.emergencyContactName !== undefined) patient.person.emergencyContactName = dto.emergencyContactName;
      if (dto.emergencyContactPhone !== undefined) patient.person.emergencyContactPhone = dto.emergencyContactPhone;
      if (dto.birthDate !== undefined) patient.person.birthDate = dto.birthDate;
      if (dto.gender !== undefined) patient.person.gender = dto.gender;
      await this.personRepo.save(patient.person);
    }

    if (dto.obraSocialId !== undefined || dto.healthInsuranceId !== undefined) {
      const selectedObraId = dto.obraSocialId !== undefined ? dto.obraSocialId : dto.healthInsuranceId;
      patient.obraSocialId = selectedObraId || undefined;
      patient.healthInsuranceId = selectedObraId || undefined;
    }

    if (dto.prepagaId !== undefined) {
      patient.prepagaId = dto.prepagaId || undefined;
    }

    await this.repo.save(patient);
    return this.findOne(patient.id);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.repo.remove(patient);
  }
}
