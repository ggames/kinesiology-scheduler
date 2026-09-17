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
exports.MedicalHistoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const medical_history_entity_1 = require("../domain/medical-history.entity");
let MedicalHistoriesService = class MedicalHistoriesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const entity = this.repo.create({
            patient: { id: dto.patientId },
            medicalRecordNumber: dto.medicalRecordNumber,
            diagnosis: dto.diagnosis,
            referringDoctor: dto.referringDoctor,
            medicalReferralDocument: dto.medicalReferralDocument,
            medicalHistory: dto.medicalHistory,
        });
        return this.repo.save(entity);
    }
    async findAll() {
        return this.repo.find({ relations: { patient: true } });
    }
    async findOne(id) {
        const found = await this.repo.findOne({ where: { id }, relations: { patient: true } });
        if (!found) {
            throw new common_1.NotFoundException(`Medical history ${id} not found`);
        }
        return found;
    }
    async findByPatientId(patientId) {
        const found = await this.repo.findOne({ where: { patient: { id: patientId } }, relations: { patient: true } });
        if (!found) {
            throw new common_1.NotFoundException(`Medical history for patient ${patientId} not found`);
        }
        return found;
    }
    async update(id, dto) {
        const found = await this.findOne(id);
        if (dto.medicalRecordNumber !== undefined)
            found.medicalRecordNumber = dto.medicalRecordNumber;
        if (dto.diagnosis !== undefined)
            found.diagnosis = dto.diagnosis;
        if (dto.referringDoctor !== undefined)
            found.referringDoctor = dto.referringDoctor;
        if (dto.medicalReferralDocument !== undefined)
            found.medicalReferralDocument = dto.medicalReferralDocument;
        if (dto.medicalHistory !== undefined)
            found.medicalHistory = dto.medicalHistory;
        if (dto.patientId !== undefined)
            found.patient = { id: dto.patientId };
        return this.repo.save(found);
    }
    async remove(id) {
        const found = await this.findOne(id);
        await this.repo.remove(found);
    }
};
exports.MedicalHistoriesService = MedicalHistoriesService;
exports.MedicalHistoriesService = MedicalHistoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medical_history_entity_1.MedicalHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MedicalHistoriesService);
//# sourceMappingURL=medical-histories.service.js.map