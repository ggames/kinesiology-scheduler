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
exports.CreateTreatmentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTreatmentDto {
    patientId;
    professionalId;
    description;
    totalSessions;
    static _OPENAPI_METADATA_FACTORY() {
        return { patientId: { required: true, type: () => String, format: "uuid" }, professionalId: { required: true, type: () => String, format: "uuid" }, description: { required: true, type: () => String }, totalSessions: { required: true, type: () => Number, minimum: 1 } };
    }
}
exports.CreateTreatmentDto = CreateTreatmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Patient UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Prescribing professional UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "professionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kinesioterapia lumbar - 10 sesiones', description: 'Treatment description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, minimum: 1, description: 'Total number of sessions prescribed' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTreatmentDto.prototype, "totalSessions", void 0);
//# sourceMappingURL=create-treatment.dto.js.map