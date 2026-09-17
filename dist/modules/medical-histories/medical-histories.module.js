"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalHistoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const medical_history_entity_1 = require("./domain/medical-history.entity");
const medical_histories_service_1 = require("./application/medical-histories.service");
const medical_histories_controller_1 = require("./infrastructure/medical-histories.controller");
let MedicalHistoriesModule = class MedicalHistoriesModule {
};
exports.MedicalHistoriesModule = MedicalHistoriesModule;
exports.MedicalHistoriesModule = MedicalHistoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([medical_history_entity_1.MedicalHistory])],
        controllers: [medical_histories_controller_1.MedicalHistoriesController],
        providers: [medical_histories_service_1.MedicalHistoriesService],
        exports: [medical_histories_service_1.MedicalHistoriesService],
    })
], MedicalHistoriesModule);
//# sourceMappingURL=medical-histories.module.js.map