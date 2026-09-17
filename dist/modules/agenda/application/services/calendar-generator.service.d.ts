import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { DoctorScheduleTemplate } from '../../doctor-schedule-template/domain/doctor-schedule-template.entity';
import { DailyAgenda } from '../../daily-agenda/domain/daily-agenda.entity';
import { TimeSlot } from '../../time-slot/domain/time-slot.entity';
import { Holiday } from '../../holiday/domain/holiday.entity';
import { Professional } from '../../../professionals/domain/professional.entity';
import { Clinic } from '../../clinic/domain/clinic.entity';
import { WeeklySchedule } from '../../weekly-schedule/domain/weekly-schedule.entity';
export interface CalendarGenerationResult {
    professionalsProcessed: number;
    agendasCreated: number;
    timeSlotsCreated: number;
    daysSkippedForHolidays: number;
    startDate: string;
    endDate: string;
}
export declare class CalendarGeneratorService implements OnModuleInit {
    private readonly templateRepo;
    private readonly agendaRepo;
    private readonly timeSlotRepo;
    private readonly holidayRepo;
    private readonly professionalRepo;
    private readonly clinicRepo;
    private readonly weeklyScheduleRepo;
    private readonly dataSource;
    private readonly logger;
    constructor(templateRepo: Repository<DoctorScheduleTemplate>, agendaRepo: Repository<DailyAgenda>, timeSlotRepo: Repository<TimeSlot>, holidayRepo: Repository<Holiday>, professionalRepo: Repository<Professional>, clinicRepo: Repository<Clinic>, weeklyScheduleRepo: Repository<WeeklySchedule>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    ensureSeedTemplatesAndClinics(): Promise<{
        clinic: Clinic;
        templatesCreated: number;
    }>;
    handleDailyRollingWindowCron(): Promise<CalendarGenerationResult>;
    generateRollingWindowFor60Days(customStartDate?: Date, daysAhead?: number): Promise<CalendarGenerationResult>;
    generateRollingWindowFor8Weeks(customStartDate?: Date, weeksAhead?: number): Promise<CalendarGenerationResult>;
    generateScheduleForProfessionalInRange(professionalId: string, startDate: Date, endDate: Date): Promise<{
        agendasCreated: number;
        timeSlotsCreated: number;
        daysSkippedForHolidays: number;
    }>;
    private generateSlotsFromTemplate;
    private parseTimeStringToMinutes;
    private formatMinutesToTimeString;
}
