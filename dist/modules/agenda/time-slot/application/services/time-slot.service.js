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
exports.TimeSlotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const time_slot_entity_1 = require("../../domain/time-slot.entity");
const time_slot_capacity_updated_event_1 = require("../../../domain/events/time-slot-capacity-updated.event");
const appointment_entity_1 = require("../../../../appointments/domain/appointment.entity");
let TimeSlotService = class TimeSlotService {
    repo;
    dataSource;
    eventEmitter;
    constructor(repo, dataSource, eventEmitter) {
        this.repo = repo;
        this.dataSource = dataSource;
        this.eventEmitter = eventEmitter;
    }
    async syncSlot(slot) {
        if (!slot)
            return slot;
        const activeCount = await this.dataSource.getRepository(appointment_entity_1.Appointment).count({
            where: {
                timeSlot: { id: slot.id },
                status: (0, typeorm_2.Not)(appointment_entity_1.AppointmentStatus.CANCELLED),
            },
        });
        let updated = false;
        if (!slot.maxCapacity || slot.maxCapacity === 1) {
            slot.maxCapacity = 6;
            updated = true;
        }
        if (slot.currentBookings !== activeCount) {
            slot.currentBookings = activeCount;
            updated = true;
        }
        const remaining = slot.maxCapacity - slot.currentBookings;
        if (remaining > 0 && slot.status === time_slot_entity_1.TimeSlotStatus.BOOKED) {
            slot.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
            updated = true;
        }
        else if (remaining <= 0 && slot.status === time_slot_entity_1.TimeSlotStatus.AVAILABLE) {
            slot.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
            updated = true;
        }
        if (slot.agenda?.date) {
            const rawDate = slot.agenda.date;
            const datePart = typeof rawDate === 'string'
                ? rawDate.substring(0, 10)
                : rawDate instanceof Date
                    ? rawDate.toISOString().split('T')[0]
                    : null;
            if (datePart) {
                const endTimePart = slot.endTime.length === 5 ? slot.endTime + ':00' : slot.endTime;
                const slotEndDateTime = new Date(`${datePart}T${endTimePart}`);
                const now = new Date();
                if (slotEndDateTime.getTime() < now.getTime() && slot.status !== time_slot_entity_1.TimeSlotStatus.EXPIRED) {
                    slot.status = time_slot_entity_1.TimeSlotStatus.EXPIRED;
                    updated = true;
                }
            }
        }
        if (updated) {
            return this.repo.save(slot);
        }
        return slot;
    }
    async findAll(date, professionalId) {
        const slots = await this.repo.find({
            relations: { agenda: true },
            order: { startTime: 'ASC' },
        });
        const synced = await Promise.all(slots.map((s) => this.syncSlot(s)));
        if (!date && !professionalId) {
            return synced;
        }
        return synced.filter((slot) => {
            if (professionalId && slot.agenda?.professionalId !== professionalId) {
                return false;
            }
            if (date && slot.agenda?.date) {
                const rawDate = slot.agenda.date;
                const datePart = typeof rawDate === 'string'
                    ? rawDate.substring(0, 10)
                    : rawDate instanceof Date
                        ? rawDate.toISOString().split('T')[0]
                        : String(rawDate).substring(0, 10);
                if (datePart !== date) {
                    return false;
                }
            }
            return true;
        });
    }
    async findByDate(date, professionalId) {
        if (!date)
            return [];
        const dateStr = date.substring(0, 10);
        const qb = this.repo.createQueryBuilder('slot')
            .leftJoinAndSelect('slot.agenda', 'agenda')
            .where("date(agenda.date) = date(:dateStr)", { dateStr })
            .orderBy('slot.startTime', 'ASC');
        if (professionalId) {
            qb.andWhere('agenda.professionalId = :professionalId', { professionalId });
        }
        const slots = await qb.getMany();
        if (slots.length === 0) {
            const allSlots = await this.repo.find({ relations: { agenda: true }, order: { startTime: 'ASC' } });
            const filtered = allSlots.filter((slot) => {
                if (!slot.agenda?.date)
                    return false;
                const rawDate = slot.agenda.date;
                const dStr = typeof rawDate === 'string'
                    ? rawDate.substring(0, 10)
                    : rawDate instanceof Date
                        ? rawDate.toISOString().split('T')[0]
                        : String(rawDate).substring(0, 10);
                if (dStr !== dateStr)
                    return false;
                if (professionalId && slot.agenda?.professionalId !== professionalId)
                    return false;
                return true;
            });
            return Promise.all(filtered.map((s) => this.syncSlot(s)));
        }
        return Promise.all(slots.map((s) => this.syncSlot(s)));
    }
    async findOne(id) {
        if (id === 'by-date' || id === 'by-date/') {
            throw new common_1.NotFoundException(`Parámetro de ruta 'by-date' no es un ID válido`);
        }
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let entity = null;
        if (isUuid) {
            entity = await this.repo.findOne({ where: { id }, relations: { agenda: true } });
        }
        if (!entity) {
            const conditions = [{ startTime: id }];
            if (isUuid) {
                conditions.push({ agendaId: id });
            }
            entity = await this.repo.findOne({
                where: conditions,
                relations: { agenda: true },
            });
        }
        if (!entity)
            throw new common_1.NotFoundException(`TimeSlot con ID o parámetro ${id} no encontrado`);
        return this.syncSlot(entity);
    }
    async create(dto) {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }
    async update(id, dto) {
        const entity = await this.findOne(id);
        if (dto.maxCapacity !== undefined) {
            if (dto.maxCapacity < entity.currentBookings) {
                throw new common_1.BadRequestException(`La capacidad máxima (${dto.maxCapacity}) no puede ser menor a las reservas activas actualizadas (${entity.currentBookings}).`);
            }
            entity.maxCapacity = dto.maxCapacity;
            const remaining = entity.maxCapacity - entity.currentBookings;
            if (remaining <= 0) {
                entity.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
            }
            else if (entity.status === time_slot_entity_1.TimeSlotStatus.BOOKED) {
                entity.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
            }
        }
        if (dto.startTime)
            entity.startTime = dto.startTime;
        if (dto.endTime)
            entity.endTime = dto.endTime;
        if (dto.agendaId)
            entity.agendaId = dto.agendaId;
        const saved = await this.repo.save(entity);
        const remaining = saved.maxCapacity - saved.currentBookings;
        this.eventEmitter.emit('slot.capacity.updated', new time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent(saved.id, Math.max(0, remaining), saved.status));
        return saved;
    }
    async updateAgendaSlotsCapacity(agendaId, maxCapacity) {
        const slots = await this.repo.find({ where: { agendaId } });
        if (!slots || slots.length === 0) {
            throw new common_1.NotFoundException(`No se encontraron slots para la agenda ${agendaId}`);
        }
        const conflicto = slots.find((s) => maxCapacity < s.currentBookings);
        if (conflicto) {
            throw new common_1.BadRequestException(`No se puede aplicar capacidad (${maxCapacity}) porque el slot ${conflicto.startTime} - ${conflicto.endTime} posee ${conflicto.currentBookings} reservas activas.`);
        }
        const actualizados = [];
        for (const slot of slots) {
            slot.maxCapacity = maxCapacity;
            const remaining = slot.maxCapacity - slot.currentBookings;
            if (remaining <= 0) {
                slot.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
            }
            else if (slot.status === time_slot_entity_1.TimeSlotStatus.BOOKED) {
                slot.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
            }
            const guardado = await this.repo.save(slot);
            actualizados.push(guardado);
            this.eventEmitter.emit('slot.capacity.updated', new time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent(guardado.id, Math.max(0, remaining), guardado.status));
        }
        return actualizados;
    }
    async updateAllSlotsCapacity(maxCapacity) {
        const slots = await this.repo.find();
        if (!slots || slots.length === 0) {
            return [];
        }
        const conflicto = slots.find((s) => maxCapacity < s.currentBookings);
        if (conflicto) {
            throw new common_1.BadRequestException(`No se puede aplicar capacidad (${maxCapacity}) porque un slot de la agenda posee ${conflicto.currentBookings} reservas activas.`);
        }
        const actualizados = [];
        for (const slot of slots) {
            slot.maxCapacity = maxCapacity;
            const remaining = slot.maxCapacity - slot.currentBookings;
            if (remaining <= 0) {
                slot.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
            }
            else if (slot.status === time_slot_entity_1.TimeSlotStatus.BOOKED) {
                slot.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
            }
            const guardado = await this.repo.save(slot);
            actualizados.push(guardado);
            this.eventEmitter.emit('slot.capacity.updated', new time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent(guardado.id, Math.max(0, remaining), guardado.status));
        }
        return actualizados;
    }
    async remove(id) {
        await this.repo.delete(id);
    }
};
exports.TimeSlotService = TimeSlotService;
exports.TimeSlotService = TimeSlotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        event_emitter_1.EventEmitter2])
], TimeSlotService);
//# sourceMappingURL=time-slot.service.js.map