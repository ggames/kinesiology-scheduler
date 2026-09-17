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
exports.Patient = exports.Gender = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const health_insurance_entity_1 = require("../../health-insurances/domain/health-insurance.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return person_entity_1.Gender; } });
let Patient = class Patient {
    id;
    person;
    personId;
    obraSocial;
    obraSocialId;
    prepaga;
    prepagaId;
    healthInsurance;
    healthInsuranceId;
    medicalHistory;
    clinic;
    clinicId;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, person: { required: true, type: () => require("../../persons/domain/person.entity").Person }, personId: { required: true, type: () => String }, obraSocial: { required: false, type: () => require("../../health-insurances/domain/health-insurance.entity").HealthInsurance }, obraSocialId: { required: false, type: () => String }, prepaga: { required: false, type: () => require("../../health-insurances/domain/health-insurance.entity").HealthInsurance }, prepagaId: { required: false, type: () => String }, healthInsurance: { required: false, type: () => require("../../health-insurances/domain/health-insurance.entity").HealthInsurance }, healthInsuranceId: { required: false, type: () => String }, medicalHistory: { required: false, type: () => require("../../medical-histories/domain/medical-history.entity").MedicalHistory }, clinic: { required: false, type: () => require("../../agenda/clinic/domain/clinic.entity").Clinic }, clinicId: { required: false, type: () => String } };
    }
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_entity_1.Person, (person) => person.patient, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'personId' }),
    __metadata("design:type", person_entity_1.Person)
], Patient.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Patient.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => health_insurance_entity_1.HealthInsurance, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'obraSocialId' }),
    __metadata("design:type", health_insurance_entity_1.HealthInsurance)
], Patient.prototype, "obraSocial", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "obraSocialId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => health_insurance_entity_1.HealthInsurance, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'prepagaId' }),
    __metadata("design:type", health_insurance_entity_1.HealthInsurance)
], Patient.prototype, "prepaga", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "prepagaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => health_insurance_entity_1.HealthInsurance, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'healthInsuranceId' }),
    __metadata("design:type", health_insurance_entity_1.HealthInsurance)
], Patient.prototype, "healthInsurance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "healthInsuranceId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('MedicalHistory', (mh) => mh.patient, { nullable: true, cascade: true }),
    __metadata("design:type", Function)
], Patient.prototype, "medicalHistory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Clinic', (clinic) => clinic.patients, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'clinicId' }),
    __metadata("design:type", Function)
], Patient.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "clinicId", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)('patients')
], Patient);
//# sourceMappingURL=patient.entity.js.map