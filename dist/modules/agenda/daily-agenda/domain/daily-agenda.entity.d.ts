import { Professional } from '../../../professionals/domain/professional.entity';
import type { TimeSlot } from '../../time-slot/domain/time-slot.entity';
export declare class DailyAgenda {
    id: string;
    professional: Professional;
    professionalId: string;
    date: Date;
    slots: TimeSlot[];
}
