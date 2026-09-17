import { HealthInsurancesService } from '../application/health-insurances.service';
import { CreateHealthInsuranceDto } from '../application/dto/create-health-insurance.dto';
export declare class HealthInsurancesController {
    private readonly service;
    constructor(service: HealthInsurancesService);
    create(dto: CreateHealthInsuranceDto): Promise<import("../domain/health-insurance.entity").HealthInsurance>;
    findAll(): Promise<import("../domain/health-insurance.entity").HealthInsurance[]>;
    findOne(id: string): Promise<import("../domain/health-insurance.entity").HealthInsurance>;
}
