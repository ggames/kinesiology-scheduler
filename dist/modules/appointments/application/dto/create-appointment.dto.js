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
exports.CreateAppointmentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAppointmentDto {
    patientId;
    professionalId;
    timeSlotId;
    appointmentDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { patientId: { required: false, type: () => String, format: "uuid" }, professionalId: { required: false, type: () => String, format: "uuid" }, timeSlotId: { required: true, type: () => String, format: "uuid" }, appointmentDate: { required: false, type: () => String } };
    }
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid', description: 'Patient UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid', description: 'Professional / Doctor UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "professionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'TimeSlot UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "timeSlotId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha deseada para la cita en formato ISO 8601 (YYYY-MM-DD o ISO DateTime)',
        example: '2026-09-15T09:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentDate", void 0);
//# sourceMappingURL=create-appointment.dto.js.map