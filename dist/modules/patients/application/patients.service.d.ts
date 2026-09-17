import { Repository } from 'typeorm';
import { Patient } from '../domain/patient.entity';
import { Person } from '../../persons/domain/person.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientsService {
    private repo;
    private personRepo;
    constructor(repo: Repository<Patient>, personRepo: Repository<Person>);
    create(dto: CreatePatientDto): Promise<Patient>;
    findAll(): Promise<Patient[]>;
    findOne(id: string): Promise<Patient>;
}
