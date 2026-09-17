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
exports.ProfessionalsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const professionals_service_1 = require("../application/professionals.service");
const create_professional_dto_1 = require("../application/dto/create-professional.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let ProfessionalsController = class ProfessionalsController {
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
exports.ProfessionalsController = ProfessionalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new professional' }),
    (0, swagger_1.ApiBody)({ type: create_professional_dto_1.CreateProfessionalDto }),
    openapi.ApiResponse({ status: 201, type: require("../domain/professional.entity").Professional }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_professional_dto_1.CreateProfessionalDto]),
    __metadata("design:returntype", void 0)
], ProfessionalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all professionals' }),
    openapi.ApiResponse({ status: 200, type: [require("../domain/professional.entity").Professional] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfessionalsController.prototype, "findAll", null);
exports.ProfessionalsController = ProfessionalsController = __decorate([
    (0, swagger_1.ApiTags)('Professionals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('professionals'),
    __metadata("design:paramtypes", [professionals_service_1.ProfessionalsService])
], ProfessionalsController);
//# sourceMappingURL=professionals.controller.js.map