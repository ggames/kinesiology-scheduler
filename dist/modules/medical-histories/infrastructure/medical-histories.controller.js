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
exports.MedicalHistoriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const medical_histories_service_1 = require("../application/medical-histories.service");
const create_medical_history_dto_1 = require("../application/dto/create-medical-history.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let MedicalHistoriesController = class MedicalHistoriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    findByPatientId(patientId) {
        return this.service.findByPatientId(patientId);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.MedicalHistoriesController = MedicalHistoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new medical history record' }),
    (0, swagger_1.ApiBody)({ type: create_medical_history_dto_1.CreateMedicalHistoryDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/medical-history.entity").MedicalHistory }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medical_history_dto_1.CreateMedicalHistoryDto]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medical history records' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/medical-history.entity").MedicalHistory] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a medical history record by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/medical-history.entity").MedicalHistory }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical history record by patient ID' }),
    openapi.ApiResponse({ status: 200, type: require("../domain/medical-history.entity").MedicalHistory }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a medical history record' }),
    (0, swagger_1.ApiBody)({ type: create_medical_history_dto_1.UpdateMedicalHistoryDto }),
    openapi.ApiResponse({ status: 200, type: require("../domain/medical-history.entity").MedicalHistory }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_medical_history_dto_1.UpdateMedicalHistoryDto]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a medical history record' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicalHistoriesController.prototype, "remove", null);
exports.MedicalHistoriesController = MedicalHistoriesController = __decorate([
    (0, swagger_1.ApiTags)('Medical Histories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('medical-histories'),
    __metadata("design:paramtypes", [medical_histories_service_1.MedicalHistoriesService])
], MedicalHistoriesController);
//# sourceMappingURL=medical-histories.controller.js.map