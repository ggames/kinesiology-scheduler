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
exports.TimeSlotController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const time_slot_service_1 = require("../application/services/time-slot.service");
const create_time_slot_dto_1 = require("../application/dto/create-time-slot.dto");
const update_time_slot_capacity_dto_1 = require("../application/dto/update-time-slot-capacity.dto");
const jwt_auth_guard_1 = require("../../../../core/auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../../../../core/auth/decorators/public.decorator");
const swagger_1 = require("@nestjs/swagger");
let TimeSlotController = class TimeSlotController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(date, professionalId) {
        if (date) {
            return this.service.findByDate(date, professionalId);
        }
        return this.service.findAll(date, professionalId);
    }
    findByDate(date, professionalId) {
        return this.service.findByDate(date, professionalId);
    }
    findSlotsAlias(date, professionalId) {
        return this.service.findByDate(date, professionalId);
    }
    updateGlobalCapacity(dto) {
        return this.service.updateAllSlotsCapacity(dto.maxCapacity);
    }
    updateAgendaCapacity(agendaId, dto) {
        return this.service.updateAgendaSlotsCapacity(agendaId, dto.maxCapacity);
    }
    updateCapacity(id, dto) {
        return this.service.update(id, { maxCapacity: dto.maxCapacity });
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.TimeSlotController = TimeSlotController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all time slots (with optional date and professionalId filtering)' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'professionalId', required: false, description: 'Professional UUID' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('professionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('by-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener únicamente los slots reales cargados para una fecha específica (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Fecha en formato YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'professionalId', required: false, description: 'ID de profesional (opcional)' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('professionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "findByDate", null);
__decorate([
    openapi.ApiQuery({ name: "professionalId", required: false }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/slots'),
    (0, common_1.Get)('/api/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Alias para obtener slots por fecha (/slots o /api/slots)' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('professionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "findSlotsAlias", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('capacity/global'),
    (0, common_1.Put)('capacity/global'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) globally for all time slots in all agendas' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "updateGlobalCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('agenda/:agendaId/capacity'),
    (0, common_1.Put)('agenda/:agendaId/capacity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) for all slots in a daily agenda' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/time-slot.entity").TimeSlot] }),
    __param(0, (0, common_1.Param)('agendaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "updateAgendaCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id/capacity'),
    (0, common_1.Put)(':id/capacity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maximum capacity (N) for a specific time slot' }),
    (0, swagger_1.ApiBody)({ type: update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto }),
    openapi.ApiResponse({ status: 200, type: require("../domain/time-slot.entity").TimeSlot }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_slot_capacity_dto_1.UpdateTimeSlotCapacityDto]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "updateCapacity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get time slot by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/time-slot.entity").TimeSlot }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new time slot' }),
    (0, swagger_1.ApiBody)({ type: create_time_slot_dto_1.CreateTimeSlotDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/time-slot.entity").TimeSlot }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_time_slot_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a time slot' }),
    (0, swagger_1.ApiBody)({ type: create_time_slot_dto_1.UpdateTimeSlotDto }),
    openapi.ApiResponse({ status: 200, type: require("../domain/time-slot.entity").TimeSlot }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_time_slot_dto_1.UpdateTimeSlotDto]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a time slot' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeSlotController.prototype, "remove", null);
exports.TimeSlotController = TimeSlotController = __decorate([
    (0, swagger_1.ApiTags)('Time Slot'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('time-slot'),
    __metadata("design:paramtypes", [time_slot_service_1.TimeSlotService])
], TimeSlotController);
//# sourceMappingURL=time-slot.controller.js.map