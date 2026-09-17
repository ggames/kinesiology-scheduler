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
exports.UpdateMedicalHistoryDto = exports.CreateMedicalHistoryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMedicalHistoryDto {
    patientId;
    medicalRecordNumber;
    diagnosis;
    referringDoctor;
    medicalReferralDocument;
    medicalHistory;
    static _OPENAPI_METADATA_FACTORY() {
        return { patientId: { required: true, type: () => String, format: "uuid" }, medicalRecordNumber: { required: false, type: () => String }, diagnosis: { required: false, type: () => String }, referringDoctor: { required: false, type: () => String }, medicalReferralDocument: { required: false, type: () => String }, medicalHistory: { required: false, type: () => String } };
    }
}
exports.CreateMedicalHistoryDto = CreateMedicalHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of the patient' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HC-2026-001', description: 'Medical record number (Número de historia clínica)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lumbago agudo post-esfuerzo', description: 'Primary diagnosis (Diagnóstico)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dr. Pérez (Traumatología)', description: 'Referring doctor (Médico derivante)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "referringDoctor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'orden_medica_123.pdf', description: 'Medical referral document reference (Orden médica)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "medicalReferralDocument", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Paciente refiere dolor lumbar de 3 semanas de evolución sin irradiación.', description: 'Detailed medical history notes (Historia clínica / Anamnesis)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalHistoryDto.prototype, "medicalHistory", void 0);
class UpdateMedicalHistoryDto extends (0, swagger_1.PartialType)(CreateMedicalHistoryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMedicalHistoryDto = UpdateMedicalHistoryDto;
//# sourceMappingURL=create-medical-history.dto.js.map