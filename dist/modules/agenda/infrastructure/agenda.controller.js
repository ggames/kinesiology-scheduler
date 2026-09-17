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
exports.AgendaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const agenda_service_1 = require("../application/agenda.service");
const calendar_generator_service_1 = require("../application/services/calendar-generator.service");
const time_slot_service_1 = require("../time-slot/application/services/time-slot.service");
const create_daily_agenda_dto_1 = require("../application/dto/create-daily-agenda.dto");
const update_time_slot_capacity_dto_1 = require("../time-slot/application/dto/update-time-slot-capacity.dto");
const jwt_auth_guard_1 = require("../../../core/auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_weekly_schedule_dto_1 = require("../application/dto/create-weekly-schedule.dto");
const public_decorator_1 = require("../../../core/auth/decorators/public.decorator");
let AgendaController = class AgendaController {
    service;
    calendarGeneratorService;
    timeSlotService;
    constructor(service, calendarGeneratorService, timeSlotService) {
        this.service = service;
        this.calendarGeneratorService = calendarGeneratorService;
        this.timeSlotService = timeSlotService;
    }
    generateRollingWindow() {
        return this.calendarGeneratorService.generateRollingWindowFor60Days();
    }
    generateForProfessional(professionalId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 59, 0, 0, 0, 0);
        return this.calendarGeneratorService.generateScheduleForProfessionalInRange(professionalId, today, endDate);
    }
    updateGlobalCapacity(dto) {
        return this.timeSlotService.updateAllSlotsCapacity(dto.maxCapacity);
    }
    updateAgendaCapacity(agendaId, dto) {
        return this.timeSlotService.updateAgendaSlotsCapacity(agendaId, dto.maxCapacity);
    }
    updateSlotCapacity(slotId, dto) {
        return this.timeSlotService.update(slotId, { maxCapacity: dto.maxCapacity });
    }
    createDailyAgenda(dto) {
        return this.service.createDailyAgendaWithSlots(dto);
    }
    findAllAgendas() {
        return this.service.findAllAgendas();
    }
    findTimeSlots(agendaId) {
        return this.service.findTimeSlots(agendaId);
    }
    bulkUpsertWeeklySchedules(clinicId, dtos) {
        return this.service.bulkUpsertWeeklySchedules(clinicId, dtos);
    }
};
exports.AgendaController = AgendaController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('generate-rolling-window'),
    (0, swagger_1.ApiOperation)({ summary: 'Disparo manual para generar o actualizar la agenda deslizante de 2 meses (60 días)' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "generateRollingWindow", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('professionals/:professionalId/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Disparo manual para generar la agenda de 2 meses de un profesional específico' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('professionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "generateForProfessional", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('capacity/global'),
    (0, common_1.Put)('capacity/global'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) globally for all time slots' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: [require("../time-slot/domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "updateGlobalCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':agendaId/capacity'),
    (0, common_1.Put)(':agendaId/capacity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) for all slots in a daily agenda' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: [require("../time-slot/domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Param)('agendaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "updateAgendaCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('slots/:slotId/capacity'),
    (0, common_1.Put)('slots/:slotId/capacity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) for a specific time slot' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: require("../time-slot/domain/time-slot.entity").TimeSlot }),
    __param(0, (0, common_1.Param)('slotId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "updateSlotCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create daily agenda and auto-generate hourly time slots' }),
    (0, swagger_1.ApiBody)({ type: create_daily_agenda_dto_1.CreateDailyAgendaDto }),
    openapi.ApiResponse({ status: 201, type: require("../daily-agenda/domain/daily-agenda.entity").DailyAgenda }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_daily_agenda_dto_1.CreateDailyAgendaDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "createDailyAgenda", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all daily agendas' }),
    openapi.ApiResponse({ status: 200, type: [require("../daily-agenda/domain/daily-agenda.entity").DailyAgenda] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "findAllAgendas", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':agendaId/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get time slots for a specific agenda' }),
    openapi.ApiResponse({ status: 200, type: [require("../time-slot/domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Param)('agendaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "findTimeSlots", null);
__decorate([
    (0, common_1.Post)('clinics/:clinicId/weekly-schedule/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk create or update weekly schedules for a clinic' }),
    (0, swagger_1.ApiBody)({ type: [create_weekly_schedule_dto_1.CreateWeeklyScheduleDto] }),
    openapi.ApiResponse({ status: 201, type: [require("../weekly-schedule/domain/weekly-schedule.entity").WeeklySchedule] }),
    __param(0, (0, common_1.Param)('clinicId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "bulkUpsertWeeklySchedules", null);
exports.AgendaController = AgendaController = __decorate([
    (0, swagger_1.ApiTags)('Agenda'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('agenda'),
    __metadata("design:paramtypes", [agenda_service_1.AgendaService,
        calendar_generator_service_1.CalendarGeneratorService,
        time_slot_service_1.TimeSlotService])
], AgendaController);
//# sourceMappingURL=agenda.controller.js.map