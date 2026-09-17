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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlot = exports.TimeSlotStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var TimeSlotStatus;
(function (TimeSlotStatus) {
    TimeSlotStatus["AVAILABLE"] = "AVAILABLE";
    TimeSlotStatus["BOOKED"] = "BOOKED";
    TimeSlotStatus["BLOCKED"] = "BLOCKED";
    TimeSlotStatus["EXPIRED"] = "EXPIRED";
})(TimeSlotStatus || (exports.TimeSlotStatus = TimeSlotStatus = {}));
let TimeSlot = class TimeSlot {
    id;
    agenda;
    agendaId;
    weeklySchedule;
    doctorScheduleTemplate;
    startTime;
    endTime;
    maxCapacity;
    currentBookings;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agenda: { required: true, type: () => require("../../daily-agenda/domain/daily-agenda.entity").DailyAgenda }, agendaId: { required: true, type: () => String }, weeklySchedule: { required: false, type: () => require("../../weekly-schedule/domain/weekly-schedule.entity").WeeklySchedule }, doctorScheduleTemplate: { required: false, type: () => require("../../doctor-schedule-template/domain/doctor-schedule-template.entity").DoctorScheduleTemplate }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, maxCapacity: { required: true, type: () => Number }, currentBookings: { required: true, type: () => Number }, status: { required: true, type: () => String } };
    }
};
exports.TimeSlot = TimeSlot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TimeSlot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('DailyAgenda', { nullable: true, eager: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'agendaId' }),
    __metadata("design:type", Function)
], TimeSlot.prototype, "agenda", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TimeSlot.prototype, "agendaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('WeeklySchedule', { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Function)
], TimeSlot.prototype, "weeklySchedule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('DoctorScheduleTemplate', { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Function)
], TimeSlot.prototype, "doctorScheduleTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], TimeSlot.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], TimeSlot.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 6 }),
    __metadata("design:type", Number)
], TimeSlot.prototype, "maxCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TimeSlot.prototype, "currentBookings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: TimeSlotStatus.AVAILABLE }),
    __metadata("design:type", String)
], TimeSlot.prototype, "status", void 0);
exports.TimeSlot = TimeSlot = __decorate([
    (0, typeorm_1.Entity)('time_slots'),
    (0, typeorm_1.Index)(['agendaId', 'startTime'], { unique: true })
], TimeSlot);
//# sourceMappingURL=time-slot.entity.js.map