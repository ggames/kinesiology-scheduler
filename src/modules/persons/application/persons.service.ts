import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../domain/person.entity';
import { CreatePersonDto, UpdatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
  ) {}

  async create(dto: CreatePersonDto): Promise<Person> {
    const existing = await this.repo.findOne({ where: { documentId: dto.documentId } });
    if (existing) {
      throw new ConflictException(`Person with document ID '${dto.documentId}' already exists`);
    }
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Person[]> {
    return this.repo.find({ relations: { patient: true, professional: true, user: true } });
  }

  async findOne(id: string): Promise<Person> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { patient: true, professional: true, user: true },
    });
    if (!found) {
      throw new NotFoundException(`Person ${id} not found`);
    }
    return found;
  }

  async findByDocumentId(documentId: string): Promise<Person | null> {
    return this.repo.findOne({
      where: { documentId },
      relations: { patient: true, professional: true, user: true },
    });
  }

  async update(id: string, dto: UpdatePersonDto): Promise<Person> {
    const found = await this.findOne(id);
    Object.assign(found, dto);
    const savedPerson = await this.repo.save(found);

    const rawDto = dto as any;
    if (found.patient && (rawDto.obraSocialId !== undefined || rawDto.healthInsuranceId !== undefined)) {
      const selectedObraId = rawDto.obraSocialId !== undefined ? rawDto.obraSocialId : rawDto.healthInsuranceId;
      found.patient.obraSocialId = selectedObraId || undefined;
      found.patient.healthInsuranceId = selectedObraId || undefined;
      await this.repo.manager.save(found.patient);
    }

    return savedPerson;
  }

  async remove(id: string): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.remove(found);
  }
}
