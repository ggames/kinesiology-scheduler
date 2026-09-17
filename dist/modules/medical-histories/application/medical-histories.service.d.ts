import { Repository } from 'typeorm';
import { MedicalHistory } from '../domain/medical-history.entity';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dto/create-medical-history.dto';
export declare class MedicalHistoriesService {
    private readonly repo;
    constructor(repo: Repository<MedicalHistory>);
    create(dto: CreateMedicalHistoryDto): Promise<MedicalHistory>;
    findAll(): Promise<MedicalHistory[]>;
    findOne(id: string): Promise<MedicalHistory>;
    findByPatientId(patientId: string): Promise<MedicalHistory>;
    update(id: string, dto: UpdateMedicalHistoryDto): Promise<MedicalHistory>;
    remove(id: string): Promise<void>;
}
