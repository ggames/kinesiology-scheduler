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
exports.RegisterPatientDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const person_entity_1 = require("../../../modules/persons/domain/person.entity");
class RegisterPatientDto {
    email;
    password;
    role = 'PATIENT';
    firstName;
    lastName;
    documentId;
    birthDate;
    gender;
    phone;
    address;
    emergencyContactName;
    emergencyContactPhone;
    clinicId;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 6 }, role: { required: false, type: () => String, default: "PATIENT" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, documentId: { required: true, type: () => String }, birthDate: { required: false, type: () => String }, gender: { required: false, enum: require("../../../modules/persons/domain/person.entity").Gender }, phone: { required: false, type: () => String }, address: { required: false, type: () => String }, emergencyContactName: { required: false, type: () => String }, emergencyContactPhone: { required: false, type: () => String }, clinicId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.RegisterPatientDto = RegisterPatientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paciente@example.com', description: 'User account email for authentication' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password123!', minLength: 6, description: 'User account password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'PATIENT', example: 'PATIENT', description: 'User role (automatically assigned as PATIENT)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan', description: 'Patient first name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Patient last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678', description: 'DNI / Document ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date', example: '1992-08-20', description: 'Birth date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: person_entity_1.Gender, example: person_entity_1.Gender.MALE, description: 'Gender' }),
    (0, class_validator_1.IsEnum)(person_entity_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491112345678', description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Cabildo 500', description: 'Address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'María Pérez', description: 'Emergency contact name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491187654321', description: 'Emergency contact phone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional clinic ID to associate' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterPatientDto.prototype, "clinicId", void 0);
//# sourceMappingURL=register-patient.dto.js.map