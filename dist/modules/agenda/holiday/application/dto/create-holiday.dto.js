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
exports.UpdateHolidayDto = exports.CreateHolidayDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const holiday_entity_1 = require("../../domain/holiday.entity");
class CreateHolidayDto {
    id;
    date;
    type;
    partialStartTime;
    partialEndTime;
    clinicId;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String, format: "uuid" }, date: { required: true, type: () => String }, type: { required: true, enum: require("../../domain/holiday.entity").HolidayType }, partialStartTime: { required: false, type: () => String }, partialEndTime: { required: false, type: () => String }, clinicId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateHolidayDto = CreateHolidayDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Holiday ID (optional when creating)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-12-25', description: 'Holiday date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: holiday_entity_1.HolidayType, example: holiday_entity_1.HolidayType.TOTAL, description: 'Type of holiday: TOTAL or PARTIAL' }),
    (0, class_validator_1.IsEnum)(holiday_entity_1.HolidayType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '08:00:00', description: 'Start time if PARTIAL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "partialStartTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12:00:00', description: 'End time if PARTIAL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "partialEndTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "clinicId", void 0);
class UpdateHolidayDto extends (0, swagger_1.PartialType)(CreateHolidayDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateHolidayDto = UpdateHolidayDto;
//# sourceMappingURL=create-holiday.dto.js.map