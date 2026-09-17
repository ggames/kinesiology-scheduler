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
exports.RegisterProfessionalDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterProfessionalDto {
    email;
    firstName;
    lastName;
    documentId;
    licenseNumber;
    specialty;
    roles = ['PROFESSIONAL'];
    phone;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, documentId: { required: true, type: () => String }, licenseNumber: { required: true, type: () => String }, specialty: { required: true, type: () => String }, roles: { required: false, type: () => [String], default: ['PROFESSIONAL'] }, phone: { required: false, type: () => String } };
    }
}
exports.RegisterProfessionalDto = RegisterProfessionalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'dr.perez@example.com', description: 'Professional email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Carlos', description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '28765432', description: 'Document ID / DNI' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MP-12345', description: 'Professional license number (Matrícula)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Traumatología y Fisioterapia', description: 'Specialty' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['PROFESSIONAL', 'ADMIN'], description: 'Assigned roles (can have multiple roles)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RegisterProfessionalDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491112345678', description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterProfessionalDto.prototype, "phone", void 0);
//# sourceMappingURL=register-professional.dto.js.map