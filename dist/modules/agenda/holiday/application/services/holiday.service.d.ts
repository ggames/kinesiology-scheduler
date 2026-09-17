import { Repository } from 'typeorm';
import { Holiday } from '../../domain/holiday.entity';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
export declare class HolidayService {
    private readonly repo;
    constructor(repo: Repository<Holiday>);
    findAll(): Promise<Holiday[]>;
    findOne(id: string): Promise<Holiday>;
    create(dto: CreateHolidayDto): Promise<Holiday>;
    update(id: string, dto: Partial<CreateHolidayDto>): Promise<Holiday>;
    remove(id: string): Promise<void>;
}
