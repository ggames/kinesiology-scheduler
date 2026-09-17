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
exports.TreatmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const treatments_service_1 = require("../application/treatments.service");
const create_treatment_dto_1 = require("../application/dto/create-treatment.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let TreatmentsController = class TreatmentsController {
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
};
exports.TreatmentsController = TreatmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new treatment order' }),
    (0, swagger_1.ApiBody)({ type: create_treatment_dto_1.CreateTreatmentDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/treatment.entity").Treatment }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_treatment_dto_1.CreateTreatmentDto]),
    __metadata("design:returntype", void 0)
], TreatmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all treatments' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/treatment.entity").Treatment] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreatmentsController.prototype, "findAll", null);
exports.TreatmentsController = TreatmentsController = __decorate([
    (0, swagger_1.ApiTags)('Treatments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('treatments'),
    __metadata("design:paramtypes", [treatments_service_1.TreatmentsService])
], TreatmentsController);
//# sourceMappingURL=treatments.controller.js.map