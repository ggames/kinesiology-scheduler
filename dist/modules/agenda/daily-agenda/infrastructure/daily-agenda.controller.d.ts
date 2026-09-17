import { DailyAgendaService } from '../application/services/daily-agenda.service';
export declare class DailyAgendaController {
    private readonly service;
    constructor(service: DailyAgendaService);
    findAll(): Promise<import("../domain/daily-agenda.entity").DailyAgenda[]>;
    findOne(id: string): Promise<import("../domain/daily-agenda.entity").DailyAgenda>;
    remove(id: string): Promise<void>;
}
