import { Patient } from '../../patients/domain/patient.entity';
import { Professional } from '../../professionals/domain/professional.entity';
import { Resource } from '../../resources/domain/resource.entity';
import { TimeSlot } from '../../agenda/time-slot/domain/time-slot.entity';
import { Treatment } from '../../treatments/domain/treatment.entity';
export declare enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Appointment {
    id: string;
    patient: Patient;
    professional: Professional;
    resource?: Resource;
    timeSlot: TimeSlot;
    treatment?: Treatment;
    status: string;
    createdAt: Date;
}
