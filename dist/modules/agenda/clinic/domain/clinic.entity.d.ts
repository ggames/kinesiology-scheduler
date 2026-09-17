import type { WeeklySchedule } from '../../weekly-schedule/domain/weekly-schedule.entity';
import type { Holiday } from '../../holiday/domain/holiday.entity';
export declare class Clinic {
    id: string;
    name: string;
    weeklySchedules: WeeklySchedule[];
    holidays: Holiday[];
    patients: any[];
}
