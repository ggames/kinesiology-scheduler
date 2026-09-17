import { Gender } from '../../../persons/domain/person.entity';
export declare class CreatePatientDto {
    personId?: string;
    firstName: string;
    lastName: string;
    documentId: string;
    birthDate?: string;
    gender?: Gender;
    address?: string;
    phone?: string;
    email?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    healthInsuranceId?: string;
    obraSocialId?: string;
    prepagaId?: string;
    clinicId?: string;
}
