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
exports.MedicalHistory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let MedicalHistory = class MedicalHistory {
    id;
    medicalRecordNumber;
    diagnosis;
    referringDoctor;
    medicalReferralDocument;
    medicalHistory;
    patient;
    patientId;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, medicalRecordNumber: { required: false, type: () => String }, diagnosis: { required: false, type: () => String }, referringDoctor: { required: false, type: () => String }, medicalReferralDocument: { required: false, type: () => String }, medicalHistory: { required: false, type: () => String }, patient: { required: true, type: () => require("../../patients/domain/patient.entity").Patient }, patientId: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.MedicalHistory = MedicalHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicalHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "referringDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "medicalReferralDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "medicalHistory", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Patient', (patient) => patient.medicalHistory, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", Function)
], MedicalHistory.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "updatedAt", void 0);
exports.MedicalHistory = MedicalHistory = __decorate([
    (0, typeorm_1.Entity)('medical_histories')
], MedicalHistory);
//# sourceMappingURL=medical-history.entity.js.map