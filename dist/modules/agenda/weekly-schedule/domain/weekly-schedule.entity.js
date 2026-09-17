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
exports.WeeklySchedule = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let WeeklySchedule = class WeeklySchedule {
    id;
    dayOfWeek;
    startTime;
    endTime;
    slotDurationMinutes;
    maxCapacityPerSlot;
    clinic;
    timeSlots;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, dayOfWeek: { required: true, type: () => Number }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, slotDurationMinutes: { required: true, type: () => Number }, maxCapacityPerSlot: { required: true, type: () => Number }, clinic: { required: true, type: () => require("../../clinic/domain/clinic.entity").Clinic }, timeSlots: { required: true, type: () => [require("../../time-slot/domain/time-slot.entity").TimeSlot] } };
    }
};
exports.WeeklySchedule = WeeklySchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WeeklySchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], WeeklySchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], WeeklySchedule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], WeeklySchedule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 60 }),
    __metadata("design:type", Number)
], WeeklySchedule.prototype, "slotDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], WeeklySchedule.prototype, "maxCapacityPerSlot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Clinic', (clinic) => clinic.weeklySchedules),
    (0, typeorm_1.JoinColumn)({ name: 'clinicId' }),
    __metadata("design:type", Function)
], WeeklySchedule.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TimeSlot', (slot) => slot.weeklySchedule),
    __metadata("design:type", Array)
], WeeklySchedule.prototype, "timeSlots", void 0);
exports.WeeklySchedule = WeeklySchedule = __decorate([
    (0, typeorm_1.Entity)('weekly_schedules')
], WeeklySchedule);
//# sourceMappingURL=weekly-schedule.entity.js.map