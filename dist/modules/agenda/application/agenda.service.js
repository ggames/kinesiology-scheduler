"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_agenda_entity_1 = require("../daily-agenda/domain/daily-agenda.entity");
const time_slot_entity_1 = require("../time-slot/domain/time-slot.entity");
const weekly_schedule_entity_1 = require("../weekly-schedule/domain/weekly-schedule.entity");
const holiday_entity_1 = require("../holiday/domain/holiday.entity");
const clinic_entity_1 = require("../clinic/domain/clinic.entity");
let AgendaService = class AgendaService {
    agendaRepo;
    timeSlotRepo;
    weeklyScheduleRepo;
    holidayRepo;
    clinicRepo;
    constructor(agendaRepo, timeSlotRepo, weeklyScheduleRepo, holidayRepo, clinicRepo) {
        this.agendaRepo = agendaRepo;
        this.timeSlotRepo = timeSlotRepo;
        this.weeklyScheduleRepo = weeklyScheduleRepo;
        this.holidayRepo = holidayRepo;
        this.clinicRepo = clinicRepo;
    }
    async createDailyAgendaWithSlots(dto) {
        const existing = await this.agendaRepo.findOne({
            where: {
                professional: { id: dto.professionalId },
                date: new Date(dto.date),
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Agenda already exists for this professional on this date');
        }
        const agenda = this.agendaRepo.create({
            professional: { id: dto.professionalId },
            date: new Date(dto.date),
        });
        const savedAgenda = await this.agendaRepo.save(agenda);
        const start = dto.startHour ?? 8;
        const end = dto.endHour ?? 18;
        const slots = [];
        for (let i = start; i < end; i++) {
            slots.push(this.timeSlotRepo.create({
                agenda: { id: savedAgenda.id },
                startTime: `${String(i).padStart(2, '0')}:00:00`,
                endTime: `${String(i + 1).padStart(2, '0')}:00:00`,
                maxCapacity: dto.maxCapacity ?? 6,
                currentBookings: 0,
                status: 'AVAILABLE',
            }));
        }
        await this.timeSlotRepo.save(slots);
        return savedAgenda;
    }
    findAllAgendas() {
        return this.agendaRepo.find({
            relations: {
                professional: true,
                slots: true,
            },
        });
    }
    findTimeSlots(agendaId) {
        return this.timeSlotRepo.find({
            where: { agenda: { id: agendaId } },
            relations: { agenda: true },
            order: { startTime: 'ASC' },
        });
    }
    async bulkUpsertWeeklySchedules(clinicId, dtos) {
        const clinic = await this.clinicRepo.findOne({ where: { id: clinicId } });
        if (!clinic) {
            throw new common_1.BadRequestException('Clinic not found');
        }
        const results = [];
        for (const dto of dtos) {
            let schedule = await this.weeklyScheduleRepo.findOne({
                where: { clinic: { id: clinicId }, dayOfWeek: dto.dayOfWeek },
            });
            if (!schedule) {
                schedule = this.weeklyScheduleRepo.create({
                    clinic,
                    dayOfWeek: dto.dayOfWeek,
                    startTime: dto.startTime,
                    endTime: dto.endTime,
                    slotDurationMinutes: dto.slotDurationMinutes ?? 60,
                    maxCapacityPerSlot: dto.maxCapacityPerSlot ?? 1,
                });
            }
            else {
                schedule.startTime = dto.startTime;
                schedule.endTime = dto.endTime;
                schedule.slotDurationMinutes = dto.slotDurationMinutes ?? 60;
                schedule.maxCapacityPerSlot =
                    dto.maxCapacityPerSlot ?? schedule.maxCapacityPerSlot;
            }
            results.push(await this.weeklyScheduleRepo.save(schedule));
        }
        return results;
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_agenda_entity_1.DailyAgenda)),
    __param(1, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    __param(2, (0, typeorm_1.InjectRepository)(weekly_schedule_entity_1.WeeklySchedule)),
    __param(3, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __param(4, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map