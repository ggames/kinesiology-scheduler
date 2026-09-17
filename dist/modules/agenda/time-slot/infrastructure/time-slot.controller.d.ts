import { TimeSlotService } from '../application/services/time-slot.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from '../application/dto/create-time-slot.dto';
import { UpdateTimeSlotCapacityDto } from '../application/dto/update-time-slot-capacity.dto';
export declare class TimeSlotController {
    private readonly service;
    constructor(service: TimeSlotService);
    findAll(date?: string, professionalId?: string): Promise<import("../domain/time-slot.entity").TimeSlot[]>;
    findByDate(date: string, professionalId?: string): Promise<import("../domain/time-slot.entity").TimeSlot[]>;
    findSlotsAlias(date: string, professionalId?: string): Promise<import("../domain/time-slot.entity").TimeSlot[]>;
    updateGlobalCapacity(dto: UpdateTimeSlotCapacityDto): Promise<import("../domain/time-slot.entity").TimeSlot[]>;
    updateAgendaCapacity(agendaId: string, dto: UpdateTimeSlotCapacityDto): Promise<import("../domain/time-slot.entity").TimeSlot[]>;
    updateCapacity(id: string, dto: UpdateTimeSlotCapacityDto): Promise<import("../domain/time-slot.entity").TimeSlot>;
    findOne(id: string): Promise<import("../domain/time-slot.entity").TimeSlot>;
    create(dto: CreateTimeSlotDto): Promise<import("../domain/time-slot.entity").TimeSlot>;
    update(id: string, dto: UpdateTimeSlotDto): Promise<import("../domain/time-slot.entity").TimeSlot>;
    remove(id: string): Promise<void>;
}
