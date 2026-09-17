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
exports.Treatment = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/domain/patient.entity");
const professional_entity_1 = require("../../professionals/domain/professional.entity");
let Treatment = class Treatment {
    id;
    patient;
    prescribingProfessional;
    description;
    totalSessions;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, patient: { required: true, type: () => require("../../patients/domain/patient.entity").Patient }, prescribingProfessional: { required: true, type: () => require("../../professionals/domain/professional.entity").Professional }, description: { required: true, type: () => String }, totalSessions: { required: true, type: () => Number } };
    }
};
exports.Treatment = Treatment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Treatment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", patient_entity_1.Patient)
], Treatment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professional_entity_1.Professional),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", professional_entity_1.Professional)
], Treatment.prototype, "prescribingProfessional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Treatment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Treatment.prototype, "totalSessions", void 0);
exports.Treatment = Treatment = __decorate([
    (0, typeorm_1.Entity)('treatments')
], Treatment);
//# sourceMappingURL=treatment.entity.js.map