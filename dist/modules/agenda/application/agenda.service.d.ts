import { Repository } from 'typeorm';
import { DailyAgenda } from '../daily-agenda/domain/daily-agenda.entity';
import { TimeSlot } from '../time-slot/domain/time-slot.entity';
import { WeeklySchedule } from '../weekly-schedule/domain/weekly-schedule.entity';
import { Holiday } from '../holiday/domain/holiday.entity';
import { Clinic } from '../clinic/domain/clinic.entity';
import { CreateDailyAgendaDto } from './dto/create-daily-agenda.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
export declare class AgendaService {
    private readonly agendaRepo;
    private readonly timeSlotRepo;
    private readonly weeklyScheduleRepo;
    private readonly holidayRepo;
    private readonly clinicRepo;
    constructor(agendaRepo: Repository<DailyAgenda>, timeSlotRepo: Repository<TimeSlot>, weeklyScheduleRepo: Repository<WeeklySchedule>, holidayRepo: Repository<Holiday>, clinicRepo: Repository<Clinic>);
    createDailyAgendaWithSlots(dto: CreateDailyAgendaDto): Promise<DailyAgenda>;
    findAllAgendas(): Promise<DailyAgenda[]>;
    findTimeSlots(agendaId: string): Promise<TimeSlot[]>;
    bulkUpsertWeeklySchedules(clinicId: string, dtos: CreateWeeklyScheduleDto[]): Promise<WeeklySchedule[]>;
}
