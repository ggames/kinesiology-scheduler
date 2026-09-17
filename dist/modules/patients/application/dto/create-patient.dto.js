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
exports.CreatePatientDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const person_entity_1 = require("../../../persons/domain/person.entity");
class CreatePatientDto {
    personId;
    firstName;
    lastName;
    documentId;
    birthDate;
    gender;
    address;
    phone;
    email;
    emergencyContactName;
    emergencyContactPhone;
    healthInsuranceId;
    obraSocialId;
    prepagaId;
    clinicId;
    static _OPENAPI_METADATA_FACTORY() {
        return { personId: { required: false, type: () => String, format: "uuid" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, documentId: { required: true, type: () => String }, birthDate: { required: false, type: () => String }, gender: { required: false, enum: require("../../../persons/domain/person.entity").Gender }, address: { required: false, type: () => String }, phone: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, emergencyContactName: { required: false, type: () => String }, emergencyContactPhone: { required: false, type: () => String }, healthInsuranceId: { required: false, type: () => String }, obraSocialId: { required: false, type: () => String }, prepagaId: { required: false, type: () => String }, clinicId: { required: false, type: () => String } };
    }
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Existing Person UUID (if person already registered)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "personId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan', description: 'Patient first name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Patient last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678', description: 'Document ID / DNI' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date', example: '1990-05-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: person_entity_1.Gender, example: person_entity_1.Gender.MALE }),
    (0, class_validator_1.IsEnum)(person_entity_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Corrientes 1234', description: 'Address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491112345678', description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'juan.perez@example.com', description: 'Email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'María Pérez', description: 'Emergency contact name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491187654321', description: 'Emergency contact phone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Health Insurance ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "healthInsuranceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Obra Social ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "obraSocialId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prepaga ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "prepagaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "clinicId", void 0);
//# sourceMappingURL=create-patient.dto.js.map