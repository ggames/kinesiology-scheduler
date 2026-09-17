import { Repository } from 'typeorm';
import { Professional } from '../domain/professional.entity';
import { Person } from '../../persons/domain/person.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
export declare class ProfessionalsService {
    private repo;
    private personRepo;
    constructor(repo: Repository<Professional>, personRepo: Repository<Person>);
    create(dto: CreateProfessionalDto): Promise<Professional>;
    findAll(): Promise<Professional[]>;
    findOne(id: string): Promise<Professional>;
}
