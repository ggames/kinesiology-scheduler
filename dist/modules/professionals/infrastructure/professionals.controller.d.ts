import { ProfessionalsService } from '../application/professionals.service';
import { CreateProfessionalDto } from '../application/dto/create-professional.dto';
export declare class ProfessionalsController {
    private readonly service;
    constructor(service: ProfessionalsService);
    create(dto: CreateProfessionalDto): Promise<import("../domain/professional.entity").Professional>;
    findAll(): Promise<import("../domain/professional.entity").Professional[]>;
}
