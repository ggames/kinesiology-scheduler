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
exports.WeeklyScheduleController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const weekly_schedule_service_1 = require("../application/services/weekly-schedule.service");
const create_weekly_schedule_dto_1 = require("../application/dto/create-weekly-schedule.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let WeeklyScheduleController = class WeeklyScheduleController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
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
exports.WeeklyScheduleController = WeeklyScheduleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all weekly schedules' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/weekly-schedule.entity").WeeklySchedule] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeeklyScheduleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly schedule by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/weekly-schedule.entity").WeeklySchedule }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeeklyScheduleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new weekly schedule' }),
    (0, swagger_1.ApiBody)({ type: create_weekly_schedule_dto_1.CreateWeeklyScheduleDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/weekly-schedule.entity").WeeklySchedule }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_weekly_schedule_dto_1.CreateWeeklyScheduleDto]),
    __metadata("design:returntype", void 0)
], WeeklyScheduleController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a weekly schedule' }),
    (0, swagger_1.ApiBody)({ type: create_weekly_schedule_dto_1.UpdateWeeklyScheduleDto }),
    openapi.ApiResponse({ status: 200, type: require("../domain/weekly-schedule.entity").WeeklySchedule }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_weekly_schedule_dto_1.UpdateWeeklyScheduleDto]),
    __metadata("design:returntype", void 0)
], WeeklyScheduleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a weekly schedule' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeeklyScheduleController.prototype, "remove", null);
exports.WeeklyScheduleController = WeeklyScheduleController = __decorate([
    (0, swagger_1.ApiTags)('Weekly Schedule'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('weekly-schedule'),
    __metadata("design:paramtypes", [weekly_schedule_service_1.WeeklyScheduleService])
], WeeklyScheduleController);
//# sourceMappingURL=weekly-schedule.controller.js.map