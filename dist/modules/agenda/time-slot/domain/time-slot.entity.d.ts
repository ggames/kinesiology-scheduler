import type { DailyAgenda } from '../../daily-agenda/domain/daily-agenda.entity';
import type { WeeklySchedule } from '../../weekly-schedule/domain/weekly-schedule.entity';
import type { DoctorScheduleTemplate } from '../../doctor-schedule-template/domain/doctor-schedule-template.entity';
export declare enum TimeSlotStatus {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED",
    BLOCKED = "BLOCKED",
    EXPIRED = "EXPIRED"
}
export declare class TimeSlot {
    id: string;
    agenda: DailyAgenda;
    agendaId: string;
    weeklySchedule?: WeeklySchedule;
    doctorScheduleTemplate?: DoctorScheduleTemplate;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    status: string;
}
