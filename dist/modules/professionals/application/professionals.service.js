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
exports.ProfessionalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const professional_entity_1 = require("../domain/professional.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
let ProfessionalsService = class ProfessionalsService {
    repo;
    personRepo;
    constructor(repo, personRepo) {
        this.repo = repo;
        this.personRepo = personRepo;
    }
    async create(dto) {
        let person = null;
        if (dto.personId) {
            person = await this.personRepo.findOne({ where: { id: dto.personId } });
            if (!person) {
                throw new common_1.NotFoundException(`Person with id '${dto.personId}' not found`);
            }
        }
        if (!person && dto.documentId) {
            person = await this.personRepo.findOne({ where: { documentId: dto.documentId } });
        }
        if (!person) {
            if (!dto.documentId) {
                throw new common_1.BadRequestException('documentId is required when creating a new professional without an existing Person record');
            }
            person = this.personRepo.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                documentId: dto.documentId,
                email: dto.email,
                phone: dto.phone,
            });
            person = await this.personRepo.save(person);
        }
        const entity = this.repo.create({
            person,
            personId: person.id,
            specialty: dto.specialty,
            licenseNumber: dto.licenseNumber,
        });
        return this.repo.save(entity);
    }
    async findAll() {
        return this.repo.find({ relations: { person: true } });
    }
    async findOne(id) {
        const found = await this.repo.findOne({
            where: { id },
            relations: { person: true },
        });
        if (!found) {
            throw new common_1.NotFoundException(`Professional ${id} not found`);
        }
        return found;
    }
};
exports.ProfessionalsService = ProfessionalsService;
exports.ProfessionalsService = ProfessionalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(professional_entity_1.Professional)),
    __param(1, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfessionalsService);
//# sourceMappingURL=professionals.service.js.map