import type { Patient } from '../../patients/domain/patient.entity';
export declare class MedicalHistory {
    id: string;
    medicalRecordNumber?: string;
    diagnosis?: string;
    referringDoctor?: string;
    medicalReferralDocument?: string;
    medicalHistory?: string;
    patient: Patient;
    patientId?: string;
    createdAt: Date;
    updatedAt: Date;
}
