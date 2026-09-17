import { Patient } from '../../patients/domain/patient.entity';
import { Professional } from '../../professionals/domain/professional.entity';
export declare class Treatment {
    id: string;
    patient: Patient;
    prescribingProfessional: Professional;
    description: string;
    totalSessions: number;
}
