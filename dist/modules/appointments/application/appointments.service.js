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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const appointment_entity_1 = require("../domain/appointment.entity");
const time_slot_entity_1 = require("../../agenda/time-slot/domain/time-slot.entity");
const time_slot_capacity_updated_event_1 = require("../../agenda/domain/events/time-slot-capacity-updated.event");
const person_entity_1 = require("../../persons/domain/person.entity");
const patient_entity_1 = require("../../patients/domain/patient.entity");
const daily_agenda_entity_1 = require("../../agenda/daily-agenda/domain/daily-agenda.entity");
const HISTORICAL_BOOKING_ALLOWED_ROLES = ['ADMIN', 'STAFF', 'PROFESSIONAL', 'admin', 'staff', 'professional'];
let AppointmentsService = class AppointmentsService {
    appointmentRepository;
    dataSource;
    eventEmitter;
    constructor(appointmentRepository, dataSource, eventEmitter) {
        this.appointmentRepository = appointmentRepository;
        this.dataSource = dataSource;
        this.eventEmitter = eventEmitter;
    }
    async create(createDto, userRole = 'PATIENT', userId) {
        return this.dataSource.transaction(async (manager) => {
            const slot = await manager.findOne(time_slot_entity_1.TimeSlot, {
                where: { id: createDto.timeSlotId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!slot) {
                throw new common_1.NotFoundException(`El turno con ID ${createDto.timeSlotId} no existe`);
            }
            if (slot.agendaId) {
                slot.agenda = (await manager.findOne(daily_agenda_entity_1.DailyAgenda, {
                    where: { id: slot.agendaId },
                    relations: { professional: true },
                }));
            }
            if ((userRole === 'PATIENT' || !HISTORICAL_BOOKING_ALLOWED_ROLES.includes(userRole) || !createDto.patientId) && userId) {
                const person = await manager.findOne(person_entity_1.Person, { where: { userId } });
                if (person) {
                    let patientProfile = await manager.findOne(patient_entity_1.Patient, { where: { personId: person.id } });
                    if (!patientProfile) {
                        patientProfile = manager.create(patient_entity_1.Patient, { person, personId: person.id });
                        patientProfile = await manager.save(patient_entity_1.Patient, patientProfile);
                    }
                    createDto.patientId = patientProfile.id;
                }
            }
            if (!createDto.patientId) {
                throw new common_1.BadRequestException('No se pudo determinar el perfil de paciente para el usuario autenticado');
            }
            if (!createDto.professionalId && slot.agenda?.professional?.id) {
                createDto.professionalId = slot.agenda.professional.id;
            }
            const now = new Date();
            const rawDate = slot.agenda?.date;
            const datePart = typeof rawDate === 'string'
                ? rawDate.substring(0, 10)
                : rawDate instanceof Date
                    ? rawDate.toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0];
            const slotStartDateTime = new Date(`${datePart}T${slot.startTime.length === 5 ? slot.startTime + ':00' : slot.startTime}`);
            const isPast = slotStartDateTime.getTime() < now.getTime();
            const isHistoricalRoleAllowed = HISTORICAL_BOOKING_ALLOWED_ROLES.includes(userRole);
            if (isPast && !isHistoricalRoleAllowed) {
                throw new common_1.BadRequestException('No se pueden reservar turnos en fechas u horas pasadas. Seleccione un horario futuro.');
            }
            const existingAppointments = await manager.find(appointment_entity_1.Appointment, {
                where: { patient: { id: createDto.patientId } },
                relations: { timeSlot: { agenda: true } },
            });
            const slotDayStr = datePart;
            const patientHasSameDayAppointment = existingAppointments.some((a) => {
                if (!a.timeSlot?.agenda?.date)
                    return false;
                const rawAppDate = a.timeSlot.agenda.date;
                const appDateStr = typeof rawAppDate === 'string'
                    ? rawAppDate.substring(0, 10)
                    : rawAppDate instanceof Date
                        ? rawAppDate.toISOString().split('T')[0]
                        : '';
                return appDateStr === slotDayStr && a.status !== appointment_entity_1.AppointmentStatus.CANCELLED;
            });
            if (patientHasSameDayAppointment) {
                throw new common_1.ConflictException(`El paciente ya posee un turno registrado para el día ${slotDayStr}`);
            }
            const activeCountBefore = await manager.count(appointment_entity_1.Appointment, {
                where: {
                    timeSlot: { id: slot.id },
                    status: (0, typeorm_2.Not)(appointment_entity_1.AppointmentStatus.CANCELLED),
                },
            });
            if (slot.status === time_slot_entity_1.TimeSlotStatus.BLOCKED || slot.status === time_slot_entity_1.TimeSlotStatus.EXPIRED || activeCountBefore >= slot.maxCapacity) {
                throw new common_1.ConflictException(`El turno solicitado se encuentra ocupado, expirado o alcanzó su capacidad máxima (capacidad máxima: ${slot.maxCapacity})`);
            }
            const appointment = manager.create(appointment_entity_1.Appointment, {
                patient: { id: createDto.patientId },
                professional: { id: createDto.professionalId },
                timeSlot: { id: createDto.timeSlotId },
                status: appointment_entity_1.AppointmentStatus.SCHEDULED,
            });
            const saved = await manager.save(appointment_entity_1.Appointment, appointment);
            const activeBookingsCount = await manager.count(appointment_entity_1.Appointment, {
                where: {
                    timeSlot: { id: slot.id },
                    status: (0, typeorm_2.Not)(appointment_entity_1.AppointmentStatus.CANCELLED),
                },
            });
            slot.currentBookings = activeBookingsCount;
            const remaining = slot.maxCapacity - slot.currentBookings;
            if (remaining <= 0) {
                slot.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
            }
            else if (slot.status !== time_slot_entity_1.TimeSlotStatus.BLOCKED) {
                slot.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
            }
            await manager.save(time_slot_entity_1.TimeSlot, slot);
            this.eventEmitter.emit('slot.capacity.updated', new time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent(slot.id, Math.max(0, remaining), slot.status));
            const fullAppointment = await manager.findOne(appointment_entity_1.Appointment, {
                where: { id: saved.id },
                relations: {
                    patient: { person: true },
                    professional: { person: true },
                    timeSlot: { agenda: true },
                    treatment: true,
                },
            });
            return {
                ...fullAppointment,
                appointmentDate: fullAppointment?.timeSlot?.agenda?.date || datePart,
            };
        });
    }
    async findAll() {
        const appointments = await this.appointmentRepository.find({
            relations: {
                patient: { person: true },
                professional: { person: true },
                timeSlot: { agenda: true },
                treatment: true,
            },
            order: { createdAt: 'DESC' },
        });
        return appointments.map((app) => ({
            ...app,
            appointmentDate: app.timeSlot?.agenda?.date || '',
        }));
    }
    async cancel(id) {
        return this.dataSource.transaction(async (manager) => {
            const appointment = await manager.findOne(appointment_entity_1.Appointment, {
                where: { id },
                relations: {
                    patient: { person: true },
                    professional: { person: true },
                    timeSlot: { agenda: true },
                },
            });
            if (!appointment) {
                throw new common_1.NotFoundException(`Cita con ID ${id} no encontrada`);
            }
            if (appointment.status === appointment_entity_1.AppointmentStatus.CANCELLED) {
                return {
                    ...appointment,
                    appointmentDate: appointment.timeSlot?.agenda?.date || '',
                };
            }
            appointment.status = appointment_entity_1.AppointmentStatus.CANCELLED;
            const savedAppointment = await manager.save(appointment_entity_1.Appointment, appointment);
            if (appointment.timeSlot?.id) {
                const slot = await manager.findOne(time_slot_entity_1.TimeSlot, {
                    where: { id: appointment.timeSlot.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (slot) {
                    if (slot.agendaId) {
                        slot.agenda = (await manager.findOne(daily_agenda_entity_1.DailyAgenda, {
                            where: { id: slot.agendaId },
                        }));
                    }
                    const activeBookingsCount = await manager.count(appointment_entity_1.Appointment, {
                        where: {
                            timeSlot: { id: slot.id },
                            status: (0, typeorm_2.Not)(appointment_entity_1.AppointmentStatus.CANCELLED),
                        },
                    });
                    slot.currentBookings = activeBookingsCount;
                    const remainingCapacity = slot.maxCapacity - slot.currentBookings;
                    if (remainingCapacity > 0 && slot.status !== time_slot_entity_1.TimeSlotStatus.BLOCKED) {
                        slot.status = time_slot_entity_1.TimeSlotStatus.AVAILABLE;
                    }
                    else if (remainingCapacity <= 0) {
                        slot.status = time_slot_entity_1.TimeSlotStatus.BOOKED;
                    }
                    await manager.save(time_slot_entity_1.TimeSlot, slot);
                    this.eventEmitter.emit('slot.capacity.updated', new time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent(slot.id, Math.max(0, remainingCapacity), slot.status));
                }
            }
            return {
                ...savedAppointment,
                appointmentDate: savedAppointment.timeSlot?.agenda?.date || '',
            };
        });
    }
    async findMyAppointments(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('ID de usuario no proporcionado');
        }
        const personRepo = this.dataSource.getRepository(person_entity_1.Person);
        const patientRepo = this.dataSource.getRepository(patient_entity_1.Patient);
        let patientId = null;
        const person = await personRepo.findOne({ where: { userId } });
        if (person) {
            let patient = await patientRepo.findOne({ where: { personId: person.id } });
            if (!patient) {
                patient = patientRepo.create({ person, personId: person.id });
                patient = await patientRepo.save(patient);
            }
            patientId = patient.id;
        }
        const appointments = await this.appointmentRepository.find({
            where: patientId
                ? [{ patient: { id: patientId } }, { patient: { person: { userId } } }]
                : [{ patient: { person: { userId } } }],
            relations: {
                patient: { person: true },
                professional: { person: true },
                timeSlot: { agenda: true },
                treatment: true,
            },
            order: { createdAt: 'DESC' },
        });
        const now = new Date();
        const result = [];
        for (const app of appointments) {
            const slot = app.timeSlot;
            if ((app.status === appointment_entity_1.AppointmentStatus.SCHEDULED || app.status === 'CONFIRMED' || app.status === 'PENDING') && slot?.agenda?.date) {
                const rawDate = slot.agenda.date;
                const datePart = typeof rawDate === 'string'
                    ? rawDate.substring(0, 10)
                    : rawDate instanceof Date
                        ? rawDate.toISOString().split('T')[0]
                        : null;
                if (datePart) {
                    const endTimePart = slot.endTime.length === 5 ? slot.endTime + ':00' : slot.endTime;
                    const slotEnd = new Date(`${datePart}T${endTimePart}`);
                    if (!isNaN(slotEnd.getTime()) && slotEnd.getTime() < now.getTime()) {
                        app.status = appointment_entity_1.AppointmentStatus.COMPLETED;
                        await this.appointmentRepository.save(app);
                        if (slot.status !== time_slot_entity_1.TimeSlotStatus.EXPIRED) {
                            slot.status = time_slot_entity_1.TimeSlotStatus.EXPIRED;
                            await this.dataSource.getRepository(time_slot_entity_1.TimeSlot).save(slot);
                        }
                    }
                }
            }
            result.push({
                ...app,
                appointmentDate: app.timeSlot?.agenda?.date || '',
            });
        }
        return result;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        event_emitter_1.EventEmitter2])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map