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
var CalendarGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_schedule_template_entity_1 = require("../../doctor-schedule-template/domain/doctor-schedule-template.entity");
const daily_agenda_entity_1 = require("../../daily-agenda/domain/daily-agenda.entity");
const time_slot_entity_1 = require("../../time-slot/domain/time-slot.entity");
const holiday_entity_1 = require("../../holiday/domain/holiday.entity");
const professional_entity_1 = require("../../../professionals/domain/professional.entity");
const clinic_entity_1 = require("../../clinic/domain/clinic.entity");
const weekly_schedule_entity_1 = require("../../weekly-schedule/domain/weekly-schedule.entity");
let CalendarGeneratorService = CalendarGeneratorService_1 = class CalendarGeneratorService {
    templateRepo;
    agendaRepo;
    timeSlotRepo;
    holidayRepo;
    professionalRepo;
    clinicRepo;
    weeklyScheduleRepo;
    dataSource;
    logger = new common_1.Logger(CalendarGeneratorService_1.name);
    constructor(templateRepo, agendaRepo, timeSlotRepo, holidayRepo, professionalRepo, clinicRepo, weeklyScheduleRepo, dataSource) {
        this.templateRepo = templateRepo;
        this.agendaRepo = agendaRepo;
        this.timeSlotRepo = timeSlotRepo;
        this.holidayRepo = holidayRepo;
        this.professionalRepo = professionalRepo;
        this.clinicRepo = clinicRepo;
        this.weeklyScheduleRepo = weeklyScheduleRepo;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        this.logger.log('Initializing CalendarGeneratorService: checking seed templates and 2-month rolling window...');
        try {
            await this.ensureSeedTemplatesAndClinics();
            const result = await this.generateRollingWindowFor60Days();
            this.logger.log(`Automatic 2-month agenda generation complete: ${result.agendasCreated} agendas and ${result.timeSlotsCreated} slots created for ${result.professionalsProcessed} professionals.`);
        }
        catch (err) {
            this.logger.error(`Error during initial 2-month agenda auto-generation: ${err.message}`);
        }
    }
    async ensureSeedTemplatesAndClinics() {
        let clinic = await this.clinicRepo.findOne({ where: {} });
        if (!clinic) {
            this.logger.log('No clinic found. Creating default clinic "Clínica Central de Kinesiología"...');
            clinic = this.clinicRepo.create({
                name: 'Clínica Central de Kinesiología',
            });
            clinic = await this.clinicRepo.save(clinic);
        }
        const weeklyScheduleCount = await this.weeklyScheduleRepo.count();
        if (weeklyScheduleCount === 0) {
            this.logger.log('Seeding default weekly schedules (Mon-Fri 08:00-18:00) for clinic...');
            const weeklySchedules = [];
            for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
                weeklySchedules.push(this.weeklyScheduleRepo.create({
                    clinic,
                    dayOfWeek,
                    startTime: '08:00:00',
                    endTime: '18:00:00',
                    slotDurationMinutes: 60,
                    maxCapacityPerSlot: 6,
                }));
            }
            await this.weeklyScheduleRepo.save(weeklySchedules);
        }
        const professionals = await this.professionalRepo.find();
        let templatesCreated = 0;
        for (const prof of professionals) {
            const existingTemplates = await this.templateRepo.count({ where: { professionalId: prof.id } });
            if (existingTemplates === 0) {
                this.logger.log(`Seeding default schedule template (Mon-Fri 08:00-18:00) for professional ${prof.id}...`);
                const defaultTemplates = [];
                for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
                    defaultTemplates.push(this.templateRepo.create({
                        professionalId: prof.id,
                        clinicId: clinic.id,
                        dayOfWeek,
                        startTime: '08:00:00',
                        endTime: '18:00:00',
                        slotDurationMinutes: 60,
                        maxCapacityPerSlot: 6,
                    }));
                }
                await this.templateRepo.save(defaultTemplates);
                templatesCreated += defaultTemplates.length;
            }
        }
        return { clinic, templatesCreated };
    }
    async handleDailyRollingWindowCron() {
        this.logger.log('Starting daily 60-day (2-month) rolling window calendar generation job...');
        const result = await this.generateRollingWindowFor60Days();
        this.logger.log(`Completed cron calendar generation: ${result.agendasCreated} agendas and ${result.timeSlotsCreated} slots created for ${result.professionalsProcessed} professionals.`);
        return result;
    }
    async generateRollingWindowFor60Days(customStartDate, daysAhead = 60) {
        const today = customStartDate ? new Date(customStartDate) : new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysAhead - 1, 0, 0, 0, 0);
        const yyyyStart = today.getFullYear();
        const mmStart = String(today.getMonth() + 1).padStart(2, '0');
        const ddStart = String(today.getDate()).padStart(2, '0');
        const startDateStr = `${yyyyStart}-${mmStart}-${ddStart}`;
        const yyyyEnd = endDate.getFullYear();
        const mmEnd = String(endDate.getMonth() + 1).padStart(2, '0');
        const ddEnd = String(endDate.getDate()).padStart(2, '0');
        const endDateStr = `${yyyyEnd}-${mmEnd}-${ddEnd}`;
        const professionals = await this.professionalRepo.find();
        let agendasCreated = 0;
        let timeSlotsCreated = 0;
        let daysSkippedForHolidays = 0;
        for (const prof of professionals) {
            const res = await this.generateScheduleForProfessionalInRange(prof.id, today, endDate);
            agendasCreated += res.agendasCreated;
            timeSlotsCreated += res.timeSlotsCreated;
            daysSkippedForHolidays += res.daysSkippedForHolidays;
        }
        return {
            professionalsProcessed: professionals.length,
            agendasCreated,
            timeSlotsCreated,
            daysSkippedForHolidays,
            startDate: startDateStr,
            endDate: endDateStr,
        };
    }
    async generateRollingWindowFor8Weeks(customStartDate, weeksAhead = 8) {
        return this.generateRollingWindowFor60Days(customStartDate, weeksAhead * 7);
    }
    async generateScheduleForProfessionalInRange(professionalId, startDate, endDate) {
        let templates = await this.templateRepo.find({
            where: { professionalId },
        });
        if (templates.length === 0) {
            const defaultTemplates = [];
            for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
                defaultTemplates.push(this.templateRepo.create({
                    professionalId,
                    dayOfWeek,
                    startTime: '08:00:00',
                    endTime: '18:00:00',
                    slotDurationMinutes: 60,
                    maxCapacityPerSlot: 6,
                }));
            }
            templates = await this.templateRepo.save(defaultTemplates);
        }
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const startDateNum = startDate.getDate();
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();
        const endDateNum = endDate.getDate();
        const startStr = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(startDateNum).padStart(2, '0')}`;
        const endStr = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-${String(endDateNum).padStart(2, '0')}`;
        const holidays = await this.holidayRepo.find();
        const holidayMap = new Map();
        for (const h of holidays) {
            if (h.date >= startStr && h.date <= endStr) {
                holidayMap.set(h.date, h);
            }
        }
        const existingAgendas = await this.agendaRepo.find({
            where: { professionalId },
        });
        const agendaMap = new Map();
        for (const a of existingAgendas) {
            let dStr = '';
            if (a.date instanceof Date) {
                const y = a.date.getFullYear();
                const m = String(a.date.getMonth() + 1).padStart(2, '0');
                const d = String(a.date.getDate()).padStart(2, '0');
                dStr = `${y}-${m}-${d}`;
            }
            else {
                dStr = String(a.date).substring(0, 10);
            }
            agendaMap.set(dStr, a);
        }
        let agendasCreated = 0;
        let timeSlotsCreated = 0;
        let daysSkippedForHolidays = 0;
        const startObj = new Date(startYear, startMonth, startDateNum, 0, 0, 0, 0);
        const endObj = new Date(endYear, endMonth, endDateNum, 0, 0, 0, 0);
        const diffDays = Math.ceil((endObj.getTime() - startObj.getTime()) / (1000 * 3600 * 24)) + 1;
        for (let dayIdx = 0; dayIdx < diffDays; dayIdx++) {
            const curr = new Date(startYear, startMonth, startDateNum + dayIdx, 0, 0, 0, 0);
            const yyyy = curr.getFullYear();
            const mm = String(curr.getMonth() + 1).padStart(2, '0');
            const dd = String(curr.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;
            const jsDay = curr.getDay();
            const isoWeekday = jsDay === 0 ? 7 : jsDay;
            const matchingTemplates = templates.filter((t) => t.dayOfWeek === isoWeekday);
            if (matchingTemplates.length > 0) {
                const holiday = holidayMap.get(dateStr);
                if (holiday && holiday.type === holiday_entity_1.HolidayType.TOTAL) {
                    daysSkippedForHolidays++;
                }
                else {
                    const queryRunner = this.dataSource.createQueryRunner();
                    await queryRunner.connect();
                    await queryRunner.startTransaction();
                    try {
                        let agenda = agendaMap.get(dateStr);
                        if (!agenda) {
                            const dateVal = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 0, 0, 0, 0);
                            agenda = queryRunner.manager.create(daily_agenda_entity_1.DailyAgenda, {
                                professionalId,
                                date: dateVal,
                            });
                            agenda = await queryRunner.manager.save(daily_agenda_entity_1.DailyAgenda, agenda);
                            agendaMap.set(dateStr, agenda);
                            agendasCreated++;
                        }
                        for (const tpl of matchingTemplates) {
                            const created = await this.generateSlotsFromTemplate(queryRunner.manager, agenda, tpl, holiday);
                            timeSlotsCreated += created;
                        }
                        await queryRunner.commitTransaction();
                    }
                    catch (err) {
                        await queryRunner.rollbackTransaction();
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        this.logger.error(`Error generating slots for professional ${professionalId} on ${dateStr}: ${errorMessage}`);
                    }
                    finally {
                        await queryRunner.release();
                    }
                }
            }
        }
        return { agendasCreated, timeSlotsCreated, daysSkippedForHolidays };
    }
    async generateSlotsFromTemplate(manager, agenda, template, holiday) {
        const slotDuration = template.slotDurationMinutes || 60;
        const startHourMin = this.parseTimeStringToMinutes(template.startTime);
        const endHourMin = this.parseTimeStringToMinutes(template.endTime);
        let createdCount = 0;
        for (let min = startHourMin; min + slotDuration <= endHourMin; min += slotDuration) {
            const slotStartTime = this.formatMinutesToTimeString(min);
            const slotEndTime = this.formatMinutesToTimeString(min + slotDuration);
            let isBlockedByHoliday = false;
            if (holiday && holiday.type === holiday_entity_1.HolidayType.PARTIAL && holiday.partialStartTime && holiday.partialEndTime) {
                const hStart = this.parseTimeStringToMinutes(holiday.partialStartTime);
                const hEnd = this.parseTimeStringToMinutes(holiday.partialEndTime);
                if (min >= hStart && min < hEnd) {
                    isBlockedByHoliday = true;
                }
            }
            const existingSlot = await manager.findOne(time_slot_entity_1.TimeSlot, {
                where: { agendaId: agenda.id, startTime: slotStartTime },
            });
            if (!existingSlot) {
                const newSlot = manager.create(time_slot_entity_1.TimeSlot, {
                    agendaId: agenda.id,
                    doctorScheduleTemplate: template,
                    startTime: slotStartTime,
                    endTime: slotEndTime,
                    maxCapacity: template.maxCapacityPerSlot || 6,
                    currentBookings: 0,
                    status: isBlockedByHoliday ? time_slot_entity_1.TimeSlotStatus.BLOCKED : time_slot_entity_1.TimeSlotStatus.AVAILABLE,
                });
                await manager.save(time_slot_entity_1.TimeSlot, newSlot);
                createdCount++;
            }
        }
        return createdCount;
    }
    parseTimeStringToMinutes(timeStr) {
        const parts = timeStr.split(':');
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        return hours * 60 + minutes;
    }
    formatMinutesToTimeString(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    }
};
exports.CalendarGeneratorService = CalendarGeneratorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarGeneratorService.prototype, "handleDailyRollingWindowCron", null);
exports.CalendarGeneratorService = CalendarGeneratorService = CalendarGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_schedule_template_entity_1.DoctorScheduleTemplate)),
    __param(1, (0, typeorm_1.InjectRepository)(daily_agenda_entity_1.DailyAgenda)),
    __param(2, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    __param(3, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __param(4, (0, typeorm_1.InjectRepository)(professional_entity_1.Professional)),
    __param(5, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __param(6, (0, typeorm_1.InjectRepository)(weekly_schedule_entity_1.WeeklySchedule)),
    __param(7, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CalendarGeneratorService);
//# sourceMappingURL=calendar-generator.service.js.map