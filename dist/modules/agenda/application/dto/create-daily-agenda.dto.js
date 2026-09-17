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
exports.CreateDailyAgendaDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDailyAgendaDto {
    professionalId;
    date;
    startHour;
    endHour;
    maxCapacity;
    static _OPENAPI_METADATA_FACTORY() {
        return { professionalId: { required: true, type: () => String, format: "uuid" }, date: { required: true, type: () => String }, startHour: { required: false, type: () => Number, minimum: 0, maximum: 23 }, endHour: { required: false, type: () => Number, minimum: 1, maximum: 24 }, maxCapacity: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.CreateDailyAgendaDto = CreateDailyAgendaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Professional UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDailyAgendaDto.prototype, "professionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDailyAgendaDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 8, description: 'Start hour for generation (0-23)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(23),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDailyAgendaDto.prototype, "startHour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 18, description: 'End hour for generation (1-24)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDailyAgendaDto.prototype, "endHour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, description: 'Max concurrent appointments per slot' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDailyAgendaDto.prototype, "maxCapacity", void 0);
//# sourceMappingURL=create-daily-agenda.dto.js.map