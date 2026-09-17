import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../domain/professional.entity';
import { Person } from '../../persons/domain/person.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private repo: Repository<Professional>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async create(dto: CreateProfessionalDto): Promise<Professional> {
    let person: Person | null = null;

    // 1. Try to look up by personId if provided
    if (dto.personId) {
      person = await this.personRepo.findOne({ where: { id: dto.personId } });
      if (!person) {
        throw new NotFoundException(`Person with id '${dto.personId}' not found`);
      }
    }

    // 2. Try to look up by documentId if person not yet resolved
    if (!person && dto.documentId) {
      person = await this.personRepo.findOne({ where: { documentId: dto.documentId } });
    }

    // 3. Create a new Person if none found — documentId is required
    if (!person) {
      if (!dto.documentId) {
        throw new BadRequestException('documentId is required when creating a new professional without an existing Person record');
      }
      person = this.personRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        documentId: dto.documentId,
        email: dto.email,
        phone: dto.phone,
      });
      person = await this.personRepo.save(person);
    }

    const entity = this.repo.create({
      person,
      personId: person.id,
      specialty: dto.specialty,
      licenseNumber: dto.licenseNumber,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<Professional[]> {
    return this.repo.find({ relations: { person: true } });
  }

  async findOne(id: string): Promise<Professional> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { person: true },
    });
    if (!found) {
      throw new NotFoundException(`Professional ${id} not found`);
    }
    return found;
  }
}
