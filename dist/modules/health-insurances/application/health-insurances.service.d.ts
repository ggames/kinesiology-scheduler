import { Repository } from 'typeorm';
import { HealthInsurance } from '../domain/health-insurance.entity';
import { CreateHealthInsuranceDto } from './dto/create-health-insurance.dto';
export declare class HealthInsurancesService {
    private repo;
    constructor(repo: Repository<HealthInsurance>);
    create(dto: CreateHealthInsuranceDto): Promise<HealthInsurance>;
    findAll(): Promise<HealthInsurance[]>;
    findOne(id: string): Promise<HealthInsurance>;
}
