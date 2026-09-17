import { PatientsService } from '../application/patients.service';
import { CreatePatientDto } from '../application/dto/create-patient.dto';
export declare class PatientsController {
    private readonly service;
    constructor(service: PatientsService);
    create(dto: CreatePatientDto): Promise<import("../domain/patient.entity").Patient>;
    findAll(): Promise<import("../domain/patient.entity").Patient[]>;
}
