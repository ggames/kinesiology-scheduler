import { Repository } from 'typeorm';
import { DailyAgenda } from '../../domain/daily-agenda.entity';
export declare class DailyAgendaService {
    private readonly repo;
    constructor(repo: Repository<DailyAgenda>);
    findAll(): Promise<DailyAgenda[]>;
    findOne(id: string): Promise<DailyAgenda>;
    remove(id: string): Promise<void>;
}
