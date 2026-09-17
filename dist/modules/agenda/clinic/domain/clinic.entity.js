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
exports.Clinic = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let Clinic = class Clinic {
    id;
    name;
    weeklySchedules;
    holidays;
    patients;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, weeklySchedules: { required: true, type: () => [require("../../weekly-schedule/domain/weekly-schedule.entity").WeeklySchedule] }, holidays: { required: true, type: () => [require("../../holiday/domain/holiday.entity").Holiday] }, patients: { required: true, type: () => [Object] } };
    }
};
exports.Clinic = Clinic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Clinic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Clinic.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('WeeklySchedule', (schedule) => schedule.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "weeklySchedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Holiday', (holiday) => holiday.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "holidays", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Patient', 'clinic'),
    __metadata("design:type", Array)
], Clinic.prototype, "patients", void 0);
exports.Clinic = Clinic = __decorate([
    (0, typeorm_1.Entity)('clinics')
], Clinic);
//# sourceMappingURL=clinic.entity.js.map