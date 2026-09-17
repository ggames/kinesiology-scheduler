import type { TimeSlot } from '../../time-slot/domain/time-slot.entity';
import type { Clinic } from '../../clinic/domain/clinic.entity';
export declare class WeeklySchedule {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    maxCapacityPerSlot: number;
    clinic: Clinic;
    timeSlots: TimeSlot[];
}
