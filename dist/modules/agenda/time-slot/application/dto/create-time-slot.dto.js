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
exports.UpdateTimeSlotDto = exports.CreateTimeSlotDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTimeSlotDto {
    agendaId;
    weeklyScheduleId;
    startTime;
    endTime;
    maxCapacity;
    static _OPENAPI_METADATA_FACTORY() {
        return { agendaId: { required: false, type: () => String, format: "uuid" }, weeklyScheduleId: { required: false, type: () => String, format: "uuid" }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, maxCapacity: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.CreateTimeSlotDto = CreateTimeSlotDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of the DailyAgenda this slot belongs to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "agendaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of the WeeklySchedule this slot belongs to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "weeklyScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00:00', description: 'Start time (HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00:00', description: 'End time (HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, description: 'Max concurrent capacity' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTimeSlotDto.prototype, "maxCapacity", void 0);
class UpdateTimeSlotDto extends (0, swagger_1.PartialType)(CreateTimeSlotDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTimeSlotDto = UpdateTimeSlotDto;
//# sourceMappingURL=create-time-slot.dto.js.map