import { WeeklyScheduleService } from '../application/services/weekly-schedule.service';
import { CreateWeeklyScheduleDto, UpdateWeeklyScheduleDto } from '../application/dto/create-weekly-schedule.dto';
export declare class WeeklyScheduleController {
    private readonly service;
    constructor(service: WeeklyScheduleService);
    findAll(): Promise<import("../domain/weekly-schedule.entity").WeeklySchedule[]>;
    findOne(id: string): Promise<import("../domain/weekly-schedule.entity").WeeklySchedule>;
    create(dto: CreateWeeklyScheduleDto): Promise<import("../domain/weekly-schedule.entity").WeeklySchedule>;
    update(id: string, dto: UpdateWeeklyScheduleDto): Promise<import("../domain/weekly-schedule.entity").WeeklySchedule>;
    remove(id: string): Promise<void>;
}
