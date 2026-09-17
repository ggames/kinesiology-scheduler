"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthInsurancesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const health_insurance_entity_1 = require("./domain/health-insurance.entity");
const health_insurances_controller_1 = require("./infrastructure/health-insurances.controller");
const health_insurances_service_1 = require("./application/health-insurances.service");
let HealthInsurancesModule = class HealthInsurancesModule {
};
exports.HealthInsurancesModule = HealthInsurancesModule;
exports.HealthInsurancesModule = HealthInsurancesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([health_insurance_entity_1.HealthInsurance])],
        controllers: [health_insurances_controller_1.HealthInsurancesController],
        providers: [health_insurances_service_1.HealthInsurancesService],
        exports: [typeorm_1.TypeOrmModule, health_insurances_service_1.HealthInsurancesService]
    })
], HealthInsurancesModule);
//# sourceMappingURL=health-insurances.module.js.map