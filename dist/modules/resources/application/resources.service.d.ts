import { Repository } from 'typeorm';
import { Resource } from '../domain/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesService {
    private repo;
    constructor(repo: Repository<Resource>);
    create(dto: CreateResourceDto): Promise<Resource>;
    findAll(): Promise<Resource[]>;
}
