import { HolidayService } from '../application/services/holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../application/dto/create-holiday.dto';
export declare class HolidayController {
    private readonly service;
    constructor(service: HolidayService);
    findAll(): Promise<import("../domain/holiday.entity").Holiday[]>;
    findOne(id: string): Promise<import("../domain/holiday.entity").Holiday>;
    create(dto: CreateHolidayDto): Promise<import("../domain/holiday.entity").Holiday>;
    update(id: string, dto: UpdateHolidayDto): Promise<import("../domain/holiday.entity").Holiday>;
    remove(id: string): Promise<void>;
}
