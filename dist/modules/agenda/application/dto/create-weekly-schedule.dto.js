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
exports.UpdateWeeklyScheduleDto = exports.CreateWeeklyScheduleDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateWeeklyScheduleDto {
    dayOfWeek;
    startTime;
    endTime;
    slotDurationMinutes;
    maxCapacityPerSlot;
    static _OPENAPI_METADATA_FACTORY() {
        return { dayOfWeek: { required: true, type: () => Number, minimum: 1, maximum: 7 }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, slotDurationMinutes: { required: false, type: () => Number }, maxCapacityPerSlot: { required: false, type: () => Number } };
    }
}
exports.CreateWeeklyScheduleDto = CreateWeeklyScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 7, example: 1, description: 'ISO weekday (1=Monday...7=Sunday)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], CreateWeeklyScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00:00', description: 'Start time (HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '18:00:00', description: 'End time (HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 60, description: 'Duration of each slot in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWeeklyScheduleDto.prototype, "slotDurationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, description: 'Max capacity per slot' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWeeklyScheduleDto.prototype, "maxCapacityPerSlot", void 0);
class UpdateWeeklyScheduleDto extends (0, swagger_1.PartialType)(CreateWeeklyScheduleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateWeeklyScheduleDto = UpdateWeeklyScheduleDto;
//# sourceMappingURL=create-weekly-schedule.dto.js.map