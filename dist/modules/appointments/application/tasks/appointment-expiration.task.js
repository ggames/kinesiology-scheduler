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
var AppointmentExpirationTask_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentExpirationTask = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../../domain/appointment.entity");
const time_slot_entity_1 = require("../../../agenda/time-slot/domain/time-slot.entity");
let AppointmentExpirationTask = AppointmentExpirationTask_1 = class AppointmentExpirationTask {
    dataSource;
    logger = new common_1.Logger(AppointmentExpirationTask_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async handleExpiration() {
        const now = new Date();
        const repo = this.dataSource.getRepository(appointment_entity_1.Appointment);
        const slotRepo = this.dataSource.getRepository(time_slot_entity_1.TimeSlot);
        try {
            const scheduledAppointments = await repo.find({
                where: { status: appointment_entity_1.AppointmentStatus.SCHEDULED },
                relations: { timeSlot: { agenda: true } },
            });
            let finalizados = 0;
            for (const appt of scheduledAppointments) {
                const slot = appt.timeSlot;
                if (!slot?.agenda?.date)
                    continue;
                const rawDate = slot.agenda.date;
                const datePart = typeof rawDate === 'string'
                    ? rawDate.substring(0, 10)
                    : rawDate instanceof Date
                        ? rawDate.toISOString().split('T')[0]
                        : null;
                if (!datePart)
                    continue;
                const endTimePart = slot.endTime.length === 5 ? slot.endTime + ':00' : slot.endTime;
                const slotEnd = new Date(`${datePart}T${endTimePart}`);
                if (slotEnd.getTime() < now.getTime()) {
                    appt.status = appointment_entity_1.AppointmentStatus.COMPLETED;
                    await repo.save(appt);
                    if (slot.status !== time_slot_entity_1.TimeSlotStatus.EXPIRED) {
                        slot.status = time_slot_entity_1.TimeSlotStatus.EXPIRED;
                        await slotRepo.save(slot);
                    }
                    finalizados++;
                }
            }
            if (finalizados > 0) {
                this.logger.log(`Auto-finalizados ${finalizados} turnos vencidos.`);
            }
        }
        catch (err) {
            this.logger.error('Error procesando auto-finalización de turnos', err);
        }
    }
};
exports.AppointmentExpirationTask = AppointmentExpirationTask;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentExpirationTask.prototype, "handleExpiration", null);
exports.AppointmentExpirationTask = AppointmentExpirationTask = AppointmentExpirationTask_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppointmentExpirationTask);
//# sourceMappingURL=appointment-expiration.task.js.map