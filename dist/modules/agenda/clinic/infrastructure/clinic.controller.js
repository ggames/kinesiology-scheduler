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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const clinic_service_1 = require("../application/services/clinic.service");
const create_clinic_dto_1 = require("../application/dto/create-clinic.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let ClinicController = class ClinicController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.ClinicController = ClinicController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all clinics' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/clinic.entity").Clinic] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get clinic by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/clinic.entity").Clinic }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clinic' }),
    (0, swagger_1.ApiBody)({ type: create_clinic_dto_1.CreateClinicDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/clinic.entity").Clinic }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_clinic_dto_1.CreateClinicDto]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a clinic' }),
    (0, swagger_1.ApiBody)({ type: create_clinic_dto_1.UpdateClinicDto }),
    openapi.ApiResponse({ status: 200, type: require("../domain/clinic.entity").Clinic }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_clinic_dto_1.UpdateClinicDto]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a clinic' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "remove", null);
exports.ClinicController = ClinicController = __decorate([
    (0, swagger_1.ApiTags)('Clinic'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('clinic'),
    __metadata("design:paramtypes", [clinic_service_1.ClinicService])
], ClinicController);
//# sourceMappingURL=clinic.controller.js.map