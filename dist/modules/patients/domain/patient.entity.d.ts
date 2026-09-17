import type { Clinic } from '../../agenda/clinic/domain/clinic.entity';
import { HealthInsurance } from '../../health-insurances/domain/health-insurance.entity';
import type { MedicalHistory } from '../../medical-histories/domain/medical-history.entity';
import { Person, Gender } from '../../persons/domain/person.entity';
export { Gender };
export declare class Patient {
    id: string;
    person: Person;
    personId: string;
    obraSocial?: HealthInsurance;
    obraSocialId?: string;
    prepaga?: HealthInsurance;
    prepagaId?: string;
    healthInsurance?: HealthInsurance;
    healthInsuranceId?: string;
    medicalHistory?: MedicalHistory;
    clinic?: Clinic;
    clinicId?: string;
}
