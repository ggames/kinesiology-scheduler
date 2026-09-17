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
exports.Professional = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const person_entity_1 = require("../../persons/domain/person.entity");
let Professional = class Professional {
    id;
    person;
    personId;
    specialty;
    licenseNumber;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, person: { required: true, type: () => require("../../persons/domain/person.entity").Person }, personId: { required: true, type: () => String }, specialty: { required: true, type: () => String }, licenseNumber: { required: false, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
};
exports.Professional = Professional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Professional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_entity_1.Person, (person) => person.professional, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'personId' }),
    __metadata("design:type", person_entity_1.Person)
], Professional.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professional.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professional.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Professional.prototype, "createdAt", void 0);
exports.Professional = Professional = __decorate([
    (0, typeorm_1.Entity)('professionals')
], Professional);
//# sourceMappingURL=professional.entity.js.map