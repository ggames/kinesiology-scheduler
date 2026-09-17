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
exports.UpdatePersonDto = exports.CreatePersonDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const person_entity_1 = require("../../domain/person.entity");
class CreatePersonDto {
    firstName;
    lastName;
    documentId;
    birthDate;
    gender;
    phone;
    email;
    address;
    emergencyContactName;
    emergencyContactPhone;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, documentId: { required: true, type: () => String }, birthDate: { required: false, type: () => String }, gender: { required: false, enum: require("../../domain/person.entity").Gender }, phone: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, emergencyContactName: { required: false, type: () => String }, emergencyContactPhone: { required: false, type: () => String } };
    }
}
exports.CreatePersonDto = CreatePersonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan', description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678', description: 'DNI / Document ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date', example: '1990-05-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: person_entity_1.Gender, example: person_entity_1.Gender.MALE }),
    (0, class_validator_1.IsEnum)(person_entity_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491112345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'juan.perez@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Corrientes 1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'María Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491187654321' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "emergencyContactPhone", void 0);
class UpdatePersonDto extends (0, swagger_1.PartialType)(CreatePersonDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePersonDto = UpdatePersonDto;
//# sourceMappingURL=create-person.dto.js.map