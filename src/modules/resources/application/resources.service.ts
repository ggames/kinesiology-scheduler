import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../domain/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private repo: Repository<Resource>,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Resource[]> {
    return this.repo.find();
  }
}
