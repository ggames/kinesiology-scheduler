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
exports.UpdateClinicDto = exports.CreateClinicDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateClinicDto {
    id;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String, format: "uuid" }, name: { required: true, type: () => String } };
    }
}
exports.CreateClinicDto = CreateClinicDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic ID (optional when creating)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClinicDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Clínica Kinesiología Central', description: 'Name of the clinic' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClinicDto.prototype, "name", void 0);
class UpdateClinicDto extends (0, swagger_1.PartialType)(CreateClinicDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateClinicDto = UpdateClinicDto;
//# sourceMappingURL=create-clinic.dto.js.map