import { AgendaService } from '../application/agenda.service';
import { CalendarGeneratorService } from '../application/services/calendar-generator.service';
import { TimeSlotService } from '../time-slot/application/services/time-slot.service';
import { CreateDailyAgendaDto } from '../application/dto/create-daily-agenda.dto';
import { UpdateTimeSlotCapacityDto } from '../time-slot/application/dto/update-time-slot-capacity.dto';
import { CreateWeeklyScheduleDto } from '../application/dto/create-weekly-schedule.dto';
export declare class AgendaController {
    private readonly service;
    private readonly calendarGeneratorService;
    private readonly timeSlotService;
    constructor(service: AgendaService, calendarGeneratorService: CalendarGeneratorService, timeSlotService: TimeSlotService);
    generateRollingWindow(): Promise<import("../application/services/calendar-generator.service").CalendarGenerationResult>;
    generateForProfessional(professionalId: string): Promise<{
        agendasCreated: number;
        timeSlotsCreated: number;
        daysSkippedForHolidays: number;
    }>;
    updateGlobalCapacity(dto: UpdateTimeSlotCapacityDto): Promise<import("../time-slot/domain/time-slot.entity").TimeSlot[]>;
    updateAgendaCapacity(agendaId: string, dto: UpdateTimeSlotCapacityDto): Promise<import("../time-slot/domain/time-slot.entity").TimeSlot[]>;
    updateSlotCapacity(slotId: string, dto: UpdateTimeSlotCapacityDto): Promise<import("../time-slot/domain/time-slot.entity").TimeSlot>;
    createDailyAgenda(dto: CreateDailyAgendaDto): Promise<import("../daily-agenda/domain/daily-agenda.entity").DailyAgenda>;
    findAllAgendas(): Promise<import("../daily-agenda/domain/daily-agenda.entity").DailyAgenda[]>;
    findTimeSlots(agendaId: string): Promise<import("../time-slot/domain/time-slot.entity").TimeSlot[]>;
    bulkUpsertWeeklySchedules(clinicId: string, dtos: CreateWeeklyScheduleDto[]): Promise<import("../weekly-schedule/domain/weekly-schedule.entity").WeeklySchedule[]>;
}
