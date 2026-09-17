import { MedicalHistoriesService } from '../application/medical-histories.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from '../application/dto/create-medical-history.dto';
export declare class MedicalHistoriesController {
    private readonly service;
    constructor(service: MedicalHistoriesService);
    create(dto: CreateMedicalHistoryDto): Promise<import("../domain/medical-history.entity").MedicalHistory>;
    findAll(): Promise<import("../domain/medical-history.entity").MedicalHistory[]>;
    findOne(id: string): Promise<import("../domain/medical-history.entity").MedicalHistory>;
    findByPatientId(patientId: string): Promise<import("../domain/medical-history.entity").MedicalHistory>;
    update(id: string, dto: UpdateMedicalHistoryDto): Promise<import("../domain/medical-history.entity").MedicalHistory>;
    remove(id: string): Promise<void>;
}
