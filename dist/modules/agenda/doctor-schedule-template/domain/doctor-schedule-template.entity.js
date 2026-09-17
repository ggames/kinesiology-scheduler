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
exports.DoctorScheduleTemplate = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const professional_entity_1 = require("../../../professionals/domain/professional.entity");
const clinic_entity_1 = require("../../clinic/domain/clinic.entity");
let DoctorScheduleTemplate = class DoctorScheduleTemplate {
    id;
    dayOfWeek;
    startTime;
    endTime;
    slotDurationMinutes;
    maxCapacityPerSlot;
    professional;
    professionalId;
    clinic;
    clinicId;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, dayOfWeek: { required: true, type: () => Number }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, slotDurationMinutes: { required: true, type: () => Number }, maxCapacityPerSlot: { required: true, type: () => Number }, professional: { required: true, type: () => require("../../../professionals/domain/professional.entity").Professional }, professionalId: { required: true, type: () => String }, clinic: { required: false, type: () => require("../../clinic/domain/clinic.entity").Clinic }, clinicId: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.DoctorScheduleTemplate = DoctorScheduleTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DoctorScheduleTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DoctorScheduleTemplate.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DoctorScheduleTemplate.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DoctorScheduleTemplate.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 60 }),
    __metadata("design:type", Number)
], DoctorScheduleTemplate.prototype, "slotDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], DoctorScheduleTemplate.prototype, "maxCapacityPerSlot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professional_entity_1.Professional, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'professionalId' }),
    __metadata("design:type", professional_entity_1.Professional)
], DoctorScheduleTemplate.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DoctorScheduleTemplate.prototype, "professionalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Clinic', { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'clinicId' }),
    __metadata("design:type", clinic_entity_1.Clinic)
], DoctorScheduleTemplate.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DoctorScheduleTemplate.prototype, "clinicId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DoctorScheduleTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DoctorScheduleTemplate.prototype, "updatedAt", void 0);
exports.DoctorScheduleTemplate = DoctorScheduleTemplate = __decorate([
    (0, typeorm_1.Entity)('doctor_schedule_templates')
], DoctorScheduleTemplate);
//# sourceMappingURL=doctor-schedule-template.entity.js.map