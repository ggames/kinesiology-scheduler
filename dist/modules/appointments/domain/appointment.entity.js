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
exports.Appointment = exports.AppointmentStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/domain/patient.entity");
const professional_entity_1 = require("../../professionals/domain/professional.entity");
const resource_entity_1 = require("../../resources/domain/resource.entity");
const time_slot_entity_1 = require("../../agenda/time-slot/domain/time-slot.entity");
const treatment_entity_1 = require("../../treatments/domain/treatment.entity");
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "SCHEDULED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
let Appointment = class Appointment {
    id;
    patient;
    professional;
    resource;
    timeSlot;
    treatment;
    status;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, patient: { required: true, type: () => require("../../patients/domain/patient.entity").Patient }, professional: { required: true, type: () => require("../../professionals/domain/professional.entity").Professional }, resource: { required: false, type: () => require("../../resources/domain/resource.entity").Resource }, timeSlot: { required: true, type: () => require("../../agenda/time-slot/domain/time-slot.entity").TimeSlot }, treatment: { required: false, type: () => require("../../treatments/domain/treatment.entity").Treatment }, status: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", patient_entity_1.Patient)
], Appointment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professional_entity_1.Professional),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", professional_entity_1.Professional)
], Appointment.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resource_entity_1.Resource, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", resource_entity_1.Resource)
], Appointment.prototype, "resource", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => time_slot_entity_1.TimeSlot),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", time_slot_entity_1.TimeSlot)
], Appointment.prototype, "timeSlot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => treatment_entity_1.Treatment, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", treatment_entity_1.Treatment)
], Appointment.prototype, "treatment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: AppointmentStatus.SCHEDULED }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)('appointments')
], Appointment);
//# sourceMappingURL=appointment.entity.js.map