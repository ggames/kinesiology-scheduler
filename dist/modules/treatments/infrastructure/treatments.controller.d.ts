import { TreatmentsService } from '../application/treatments.service';
import { CreateTreatmentDto } from '../application/dto/create-treatment.dto';
export declare class TreatmentsController {
    private readonly service;
    constructor(service: TreatmentsService);
    create(dto: CreateTreatmentDto): Promise<import("../domain/treatment.entity").Treatment>;
    findAll(): Promise<import("../domain/treatment.entity").Treatment[]>;
}
