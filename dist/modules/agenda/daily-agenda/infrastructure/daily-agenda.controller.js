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
exports.DailyAgendaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const daily_agenda_service_1 = require("../application/services/daily-agenda.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let DailyAgendaController = class DailyAgendaController {
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
    remove(id) {
        return this.service.remove(id);
    }
};
exports.DailyAgendaController = DailyAgendaController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all daily agendas' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/daily-agenda.entity").DailyAgenda] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DailyAgendaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily agenda by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/daily-agenda.entity").DailyAgenda }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyAgendaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a daily agenda' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyAgendaController.prototype, "remove", null);
exports.DailyAgendaController = DailyAgendaController = __decorate([
    (0, swagger_1.ApiTags)('Daily Agenda'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('daily-agenda'),
    __metadata("design:paramtypes", [daily_agenda_service_1.DailyAgendaService])
], DailyAgendaController);
//# sourceMappingURL=daily-agenda.controller.js.map