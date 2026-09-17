import { Repository } from 'typeorm';
import { Person } from '../domain/person.entity';
import { CreatePersonDto, UpdatePersonDto } from './dto/create-person.dto';
export declare class PersonsService {
    private readonly repo;
    constructor(repo: Repository<Person>);
    create(dto: CreatePersonDto): Promise<Person>;
    findAll(): Promise<Person[]>;
    findOne(id: string): Promise<Person>;
    findByDocumentId(documentId: string): Promise<Person | null>;
    update(id: string, dto: UpdatePersonDto): Promise<Person>;
    remove(id: string): Promise<void>;
}
