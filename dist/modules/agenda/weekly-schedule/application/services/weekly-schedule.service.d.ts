import { Repository } from 'typeorm';
import { WeeklySchedule } from '../../domain/weekly-schedule.entity';
import { CreateWeeklyScheduleDto } from '../dto/create-weekly-schedule.dto';
export declare class WeeklyScheduleService {
    private readonly repo;
    constructor(repo: Repository<WeeklySchedule>);
    findAll(): Promise<WeeklySchedule[]>;
    findOne(id: string): Promise<WeeklySchedule>;
    create(dto: CreateWeeklyScheduleDto): Promise<WeeklySchedule>;
    update(id: string, dto: Partial<CreateWeeklyScheduleDto>): Promise<WeeklySchedule>;
    remove(id: string): Promise<void>;
}
