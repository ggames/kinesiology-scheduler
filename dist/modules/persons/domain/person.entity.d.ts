import { User } from '../../users/domain/user.entity';
import type { Patient } from '../../patients/domain/patient.entity';
import type { Professional } from '../../professionals/domain/professional.entity';
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    NOT_SPECIFIED = "NOT_SPECIFIED"
}
export declare class Person {
    id: string;
    firstName: string;
    lastName: string;
    documentId: string;
    birthDate?: string;
    gender: Gender;
    phone?: string;
    email?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    user?: User;
    userId?: string;
    patient?: Patient;
    professional?: Professional;
    createdAt: Date;
    updatedAt: Date;
}
