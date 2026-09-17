import { Repository } from 'typeorm';
import { Treatment } from '../domain/treatment.entity';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
export declare class TreatmentsService {
    private repo;
    constructor(repo: Repository<Treatment>);
    create(dto: CreateTreatmentDto): Promise<Treatment>;
    findAll(): Promise<Treatment[]>;
}
