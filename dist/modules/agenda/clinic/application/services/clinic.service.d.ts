import { Repository } from 'typeorm';
import { Clinic } from '../../domain/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
export declare class ClinicService {
    private readonly repo;
    constructor(repo: Repository<Clinic>);
    findAll(): Promise<Clinic[]>;
    findOne(id: string): Promise<Clinic>;
    create(dto: CreateClinicDto): Promise<Clinic>;
    update(id: string, dto: Partial<CreateClinicDto>): Promise<Clinic>;
    remove(id: string): Promise<void>;
}
