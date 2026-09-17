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
exports.AppointmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const appointments_service_1 = require("../application/appointments.service");
const create_appointment_dto_1 = require("../application/dto/create-appointment.dto");
const swagger_1 = require("@nestjs/swagger");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    findMyAppointments(req) {
        const userId = req.user?.userId;
        return this.appointmentsService.findMyAppointments(userId);
    }
    create(createAppointmentDto, req) {
        const userRole = req.user?.role || 'PATIENT';
        const userId = req.user?.userId;
        return this.appointmentsService.create(createAppointmentDto, userRole, userId);
    }
    findAll() {
        return this.appointmentsService.findAll();
    }
    cancel(id) {
        return this.appointmentsService.cancel(id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)('my-appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments for the logged-in patient' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findMyAppointments", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new appointment' }),
    (0, swagger_1.ApiBody)({ type: create_appointment_dto_1.CreateAppointmentDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/appointment.entity").Appointment }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all appointments' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "cancel", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map