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
exports.User = exports.UserStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    id;
    email;
    passwordHash;
    role;
    roles;
    status;
    activationToken;
    activationTokenExpiresAt;
    person;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, role: { required: true, type: () => String }, roles: { required: false, type: () => [String] }, status: { required: true, enum: require("./user.entity").UserStatus }, activationToken: { required: false, type: () => String }, activationTokenExpiresAt: { required: false, type: () => Date }, person: { required: false, type: () => require("../../persons/domain/person.entity").Person }, createdAt: { required: true, type: () => Date } };
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PATIENT' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "activationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "activationTokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Person', (person) => person.user),
    __metadata("design:type", Function)
], User.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map