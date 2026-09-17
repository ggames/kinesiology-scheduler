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
exports.CreateProfessionalDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateProfessionalDto {
    personId;
    firstName;
    lastName;
    specialty;
    documentId;
    licenseNumber;
    email;
    phone;
    static _OPENAPI_METADATA_FACTORY() {
        return { personId: { required: false, type: () => String, format: "uuid" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, specialty: { required: true, type: () => String }, documentId: { required: true, type: () => String }, licenseNumber: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, phone: { required: false, type: () => String } };
    }
}
exports.CreateProfessionalDto = CreateProfessionalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Existing Person UUID (if person already registered). When provided, documentId is optional.' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "personId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Carlos', description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Traumatología', description: 'Specialty' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '28765432', description: 'Document ID / DNI. Required if personId is not provided.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MP-12345', description: 'Professional license number (Matrícula)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'carlos.perez@example.com', description: 'Email' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491112345678', description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "phone", void 0);
//# sourceMappingURL=create-professional.dto.js.map