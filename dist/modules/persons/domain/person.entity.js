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
exports.Person = exports.Gender = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/domain/user.entity");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    Gender["NOT_SPECIFIED"] = "NOT_SPECIFIED";
})(Gender || (exports.Gender = Gender = {}));
let Person = class Person {
    id;
    firstName;
    lastName;
    documentId;
    birthDate;
    gender;
    phone;
    email;
    address;
    emergencyContactName;
    emergencyContactPhone;
    user;
    userId;
    patient;
    professional;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, documentId: { required: true, type: () => String }, birthDate: { required: false, type: () => String }, gender: { required: true, enum: require("./person.entity").Gender }, phone: { required: false, type: () => String }, email: { required: false, type: () => String }, address: { required: false, type: () => String }, emergencyContactName: { required: false, type: () => String }, emergencyContactPhone: { required: false, type: () => String }, user: { required: false, type: () => require("../../users/domain/user.entity").User }, userId: { required: false, type: () => String }, patient: { required: false, type: () => require("../../patients/domain/patient.entity").Patient }, professional: { required: false, type: () => require("../../professionals/domain/professional.entity").Professional }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Person = Person;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Person.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Person.prototype, "documentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: Gender.NOT_SPECIFIED }),
    __metadata("design:type", String)
], Person.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, unique: true }),
    __metadata("design:type", String)
], Person.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "emergencyContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Person.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Patient', (patient) => patient.person, { nullable: true }),
    __metadata("design:type", Function)
], Person.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Professional', (professional) => professional.person, { nullable: true }),
    __metadata("design:type", Function)
], Person.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "updatedAt", void 0);
exports.Person = Person = __decorate([
    (0, typeorm_1.Entity)('persons')
], Person);
//# sourceMappingURL=person.entity.js.map