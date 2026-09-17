import { Professional } from '../../../professionals/domain/professional.entity';
import { Clinic } from '../../clinic/domain/clinic.entity';
export declare class DoctorScheduleTemplate {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    maxCapacityPerSlot: number;
    professional: Professional;
    professionalId: string;
    clinic?: Clinic;
    clinicId?: string;
    createdAt: Date;
    updatedAt: Date;
}
