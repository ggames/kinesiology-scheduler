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
exports.DailyAgenda = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const professional_entity_1 = require("../../../professionals/domain/professional.entity");
let DailyAgenda = class DailyAgenda {
    id;
    professional;
    professionalId;
    date;
    slots;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, professional: { required: true, type: () => require("../../../professionals/domain/professional.entity").Professional }, professionalId: { required: true, type: () => String }, date: { required: true, type: () => Date }, slots: { required: true, type: () => [require("../../time-slot/domain/time-slot.entity").TimeSlot] } };
    }
};
exports.DailyAgenda = DailyAgenda;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyAgenda.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professional_entity_1.Professional, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'professionalId' }),
    __metadata("design:type", professional_entity_1.Professional)
], DailyAgenda.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DailyAgenda.prototype, "professionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DailyAgenda.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TimeSlot', (slot) => slot.agenda),
    __metadata("design:type", Array)
], DailyAgenda.prototype, "slots", void 0);
exports.DailyAgenda = DailyAgenda = __decorate([
    (0, typeorm_1.Entity)('daily_agendas'),
    (0, typeorm_1.Index)(['professionalId', 'date'], { unique: true })
], DailyAgenda);
//# sourceMappingURL=daily-agenda.entity.js.map