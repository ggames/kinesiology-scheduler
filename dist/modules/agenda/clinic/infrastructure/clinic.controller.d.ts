import { ClinicService } from '../application/services/clinic.service';
import { CreateClinicDto, UpdateClinicDto } from '../application/dto/create-clinic.dto';
export declare class ClinicController {
    private readonly service;
    constructor(service: ClinicService);
    findAll(): Promise<import("../domain/clinic.entity").Clinic[]>;
    findOne(id: string): Promise<import("../domain/clinic.entity").Clinic>;
    create(dto: CreateClinicDto): Promise<import("../domain/clinic.entity").Clinic>;
    update(id: string, dto: UpdateClinicDto): Promise<import("../domain/clinic.entity").Clinic>;
    remove(id: string): Promise<void>;
}
