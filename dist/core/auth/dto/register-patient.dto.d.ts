import { Gender } from '../../../modules/persons/domain/person.entity';
export declare class RegisterPatientDto {
    email: string;
    password: string;
    role?: string;
    firstName: string;
    lastName: string;
    documentId: string;
    birthDate?: string;
    gender?: Gender;
    phone?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    clinicId?: string;
}
