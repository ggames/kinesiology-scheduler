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
exports.Holiday = exports.HolidayType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var HolidayType;
(function (HolidayType) {
    HolidayType["TOTAL"] = "TOTAL";
    HolidayType["PARTIAL"] = "PARTIAL";
})(HolidayType || (exports.HolidayType = HolidayType = {}));
let Holiday = class Holiday {
    id;
    date;
    type;
    partialStartTime;
    partialEndTime;
    clinic;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, date: { required: true, type: () => String }, type: { required: true, enum: require("./holiday.entity").HolidayType }, partialStartTime: { required: false, type: () => String }, partialEndTime: { required: false, type: () => String }, clinic: { required: true, type: () => require("../../clinic/domain/clinic.entity").Clinic } };
    }
};
exports.Holiday = Holiday;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Holiday.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', unique: true }),
    __metadata("design:type", String)
], Holiday.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: HolidayType.TOTAL }),
    __metadata("design:type", String)
], Holiday.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Holiday.prototype, "partialStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Holiday.prototype, "partialEndTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Clinic', (clinic) => clinic.holidays),
    (0, typeorm_1.JoinColumn)({ name: 'clinicId' }),
    __metadata("design:type", Function)
], Holiday.prototype, "clinic", void 0);
exports.Holiday = Holiday = __decorate([
    (0, typeorm_1.Entity)('holidays')
], Holiday);
//# sourceMappingURL=holiday.entity.js.map