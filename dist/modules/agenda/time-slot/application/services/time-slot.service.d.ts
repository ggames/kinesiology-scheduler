import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TimeSlot } from '../../domain/time-slot.entity';
import { CreateTimeSlotDto } from '../dto/create-time-slot.dto';
export declare class TimeSlotService {
    private readonly repo;
    private readonly dataSource;
    private readonly eventEmitter;
    constructor(repo: Repository<TimeSlot>, dataSource: DataSource, eventEmitter: EventEmitter2);
    private syncSlot;
    findAll(date?: string, professionalId?: string): Promise<TimeSlot[]>;
    findByDate(date: string, professionalId?: string): Promise<TimeSlot[]>;
    findOne(id: string): Promise<TimeSlot>;
    create(dto: CreateTimeSlotDto): Promise<TimeSlot>;
    update(id: string, dto: Partial<CreateTimeSlotDto>): Promise<TimeSlot>;
    updateAgendaSlotsCapacity(agendaId: string, maxCapacity: number): Promise<TimeSlot[]>;
    updateAllSlotsCapacity(maxCapacity: number): Promise<TimeSlot[]>;
    remove(id: string): Promise<void>;
}
