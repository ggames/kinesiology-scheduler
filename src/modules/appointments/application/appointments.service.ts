import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Appointment, AppointmentStatus } from '../domain/appointment.entity';
import { TimeSlot, TimeSlotStatus } from '../../agenda/time-slot/domain/time-slot.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { TimeSlotCapacityUpdatedEvent } from '../../agenda/domain/events/time-slot-capacity-updated.event';
import { Person } from '../../persons/domain/person.entity';
import { Patient } from '../../patients/domain/patient.entity';
import { DailyAgenda } from '../../agenda/daily-agenda/domain/daily-agenda.entity';
import { Holiday, HolidayType } from '../../agenda/holiday/domain/holiday.entity';

/** Roles con permiso administrativo / médico para registrar turnos en el pasado */
const HISTORICAL_BOOKING_ALLOWED_ROLES = ['ADMIN', 'STAFF', 'PROFESSIONAL', 'admin', 'staff', 'professional'];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Crea una cita/turno garantizando:
   * 1. Bloqueo pesimista sobre el TimeSlot (prevención de condiciones de carrera).
   * 2. Validación minuto a minuto de fechas y horas pasadas.
   * 3. Excepción de carga histórica para roles ADMIN / STAFF / PROFESSIONAL.
   * 4. Prevensión de duplicados del paciente en la misma fecha.
   * 5. Blindaje contra manipulaciones IDOR para el rol PATIENT.
   */
  async create(createDto: CreateAppointmentDto, userRole: string = 'PATIENT', userId?: string): Promise<Appointment> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Obtener slot con bloqueo pesimista de escritura (FOR UPDATE sin JOINs para compatibilidad PostgreSQL)
      const slot = await manager.findOne(TimeSlot, {
        where: { id: createDto.timeSlotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) {
        throw new NotFoundException(
          `El turno con ID ${createDto.timeSlotId} no existe`,
        );
      }

      // Cargar la agenda asociada por separado (PostgreSQL prohíbe FOR UPDATE en el lado nullable de outer joins)
      if (slot.agendaId) {
        slot.agenda = (await manager.findOne(DailyAgenda, {
          where: { id: slot.agendaId },
          relations: { professional: true },
        })) as any;
      }

      // 0. Blindaje IDOR y Auto-Resolución de paciente
      if ((userRole === 'PATIENT' || !HISTORICAL_BOOKING_ALLOWED_ROLES.includes(userRole) || !createDto.patientId) && userId) {
        const person = await manager.findOne(Person, { where: { userId } });
        if (person) {
          let patientProfile = await manager.findOne(Patient, { where: { personId: person.id } });
          if (!patientProfile) {
            patientProfile = manager.create(Patient, { person, personId: person.id });
            patientProfile = await manager.save(Patient, patientProfile);
          }
          createDto.patientId = patientProfile.id;
        }
      }

      if (!createDto.patientId) {
        throw new BadRequestException('No se pudo determinar el perfil de paciente para el usuario autenticado');
      }

      if (!createDto.professionalId && slot.agenda?.professional?.id) {
        createDto.professionalId = slot.agenda.professional.id;
      }

      // 2. Construir fecha/hora exacta del inicio del slot
      const now = new Date();
      const rawDate: any = slot.agenda?.date;
      const datePart = typeof rawDate === 'string'
        ? rawDate.substring(0, 10)
        : rawDate instanceof Date
        ? rawDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const slotStartDateTime = new Date(`${datePart}T${slot.startTime.length === 5 ? slot.startTime + ':00' : slot.startTime}`);

      // 3. Validación de Fechas y Horas Pasadas (minuto a minuto para 'hoy')
      const isPast = slotStartDateTime.getTime() < now.getTime();
      const isHistoricalRoleAllowed = HISTORICAL_BOOKING_ALLOWED_ROLES.includes(userRole);

      if (isPast && !isHistoricalRoleAllowed) {
        throw new BadRequestException(
          'No se pueden reservar turnos en fechas u horas pasadas. Seleccione un horario futuro.',
        );
      }

      // 3b. Validar que el slot no sea sábado, domingo ni feriado TOTAL
      const slotDate = new Date(`${datePart}T00:00:00`);
      const jsDay = slotDate.getDay(); // 0=Dom, 6=Sáb
      if (jsDay === 0 || jsDay === 6) {
        throw new BadRequestException(
          'No se pueden reservar turnos los sábados ni domingos.',
        );
      }

      const holiday = await this.holidayRepository.findOne({ where: { date: datePart } });
      if (holiday && holiday.type === HolidayType.TOTAL) {
        throw new BadRequestException(
          `No se pueden reservar turnos en días feriados: ${datePart}.`,
        );
      }

      // 4. Validar que el paciente no tenga ya un turno reservado para la misma fecha
      const existingAppointments = await manager.find(Appointment, {
        where: { patient: { id: createDto.patientId } },
        relations: { timeSlot: { agenda: true } },
      });

      const slotDayStr = datePart;
      const patientHasSameDayAppointment = existingAppointments.some((a) => {
        if (!a.timeSlot?.agenda?.date) return false;
        const rawAppDate: any = a.timeSlot.agenda.date;
        const appDateStr = typeof rawAppDate === 'string'
          ? rawAppDate.substring(0, 10)
          : rawAppDate instanceof Date
          ? rawAppDate.toISOString().split('T')[0]
          : '';
        return appDateStr === slotDayStr && a.status !== AppointmentStatus.CANCELLED;
      });

      if (patientHasSameDayAppointment) {
        throw new ConflictException(
          `El paciente ya posee un turno registrado para el día ${slotDayStr}`,
        );
      }

      // 5. Validar disponibilidad y estado del slot contando citas activas
      const activeCountBefore = await manager.count(Appointment, {
        where: {
          timeSlot: { id: slot.id },
          status: Not(AppointmentStatus.CANCELLED),
        },
      });

      if (slot.status === TimeSlotStatus.BLOCKED || slot.status === TimeSlotStatus.EXPIRED || activeCountBefore >= slot.maxCapacity) {
        throw new ConflictException(
          `El turno solicitado se encuentra ocupado, expirado o alcanzó su capacidad máxima (capacidad máxima: ${slot.maxCapacity})`,
        );
      }

      // 6. Crear y guardar la cita
      const appointment = manager.create(Appointment, {
        patient: { id: createDto.patientId } as any,
        professional: { id: createDto.professionalId } as any,
        timeSlot: { id: createDto.timeSlotId } as any,
        status: AppointmentStatus.SCHEDULED,
      });

      const saved = await manager.save(Appointment, appointment);

      // 7. Recalcular reservas del slot de forma precisa según citas activas en BD
      const activeBookingsCount = await manager.count(Appointment, {
        where: {
          timeSlot: { id: slot.id },
          status: Not(AppointmentStatus.CANCELLED),
        },
      });

      slot.currentBookings = activeBookingsCount;
      const remaining = slot.maxCapacity - slot.currentBookings;

      if (remaining <= 0) {
        slot.status = TimeSlotStatus.BOOKED;
      } else if (slot.status !== TimeSlotStatus.BLOCKED) {
        slot.status = TimeSlotStatus.AVAILABLE;
      }
      await manager.save(TimeSlot, slot);

      // 8. Emitir evento de actualización de capacidad (para WebSockets / listeners)
      this.eventEmitter.emit(
        'slot.capacity.updated',
        new TimeSlotCapacityUpdatedEvent(
          slot.id,
          Math.max(0, remaining),
          slot.status,
        ),
      );

      const fullAppointment = await manager.findOne(Appointment, {
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
      } as any;
    });
  }

  async findAll(): Promise<any[]> {
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

  async cancel(id: string): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointment, {
        where: { id },
        relations: {
          patient: { person: true },
          professional: { person: true },
          timeSlot: { agenda: true },
        },
      });

      if (!appointment) {
        throw new NotFoundException(`Cita con ID ${id} no encontrada`);
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        return {
          ...appointment,
          appointmentDate: appointment.timeSlot?.agenda?.date || '',
        };
      }

      // Marcar cita como cancelada
      appointment.status = AppointmentStatus.CANCELLED;
      const savedAppointment = await manager.save(Appointment, appointment);

      // Si la cita tenía un slot asignado, recuento atómico de reservas activas
      if (appointment.timeSlot?.id) {
        const slot = await manager.findOne(TimeSlot, {
          where: { id: appointment.timeSlot.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (slot) {
          if (slot.agendaId) {
            slot.agenda = (await manager.findOne(DailyAgenda, {
              where: { id: slot.agendaId },
            })) as any;
          }
          const activeBookingsCount = await manager.count(Appointment, {
            where: {
              timeSlot: { id: slot.id },
              status: Not(AppointmentStatus.CANCELLED),
            },
          });

          slot.currentBookings = activeBookingsCount;
          const remainingCapacity = slot.maxCapacity - slot.currentBookings;

          if (remainingCapacity > 0 && slot.status !== TimeSlotStatus.BLOCKED) {
            slot.status = TimeSlotStatus.AVAILABLE;
          } else if (remainingCapacity <= 0) {
            slot.status = TimeSlotStatus.BOOKED;
          }

          await manager.save(TimeSlot, slot);

          // Emitir evento de actualización de capacidad para WebSockets / listeners
          this.eventEmitter.emit(
            'slot.capacity.updated',
            new TimeSlotCapacityUpdatedEvent(
              slot.id,
              Math.max(0, remainingCapacity),
              slot.status,
            ),
          );
        }
      }

      return {
        ...savedAppointment,
        appointmentDate: savedAppointment.timeSlot?.agenda?.date || '',
      };
    });
  }

  /**
   * Obtiene los turnos del paciente logueado (Aislamiento de Recursos IDOR)
   * e invalida/finaliza reactivamente según la hora del servidor (Source of Truth).
   */
  async findMyAppointments(userId: string): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('ID de usuario no proporcionado');
    }

    const personRepo = this.dataSource.getRepository(Person);
    const patientRepo = this.dataSource.getRepository(Patient);

    let patientId: string | null = null;
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
    const result: any[] = [];

    for (const app of appointments) {
      const slot = app.timeSlot;
      if ((app.status === AppointmentStatus.SCHEDULED || app.status === 'CONFIRMED' || app.status === 'PENDING') && slot?.agenda?.date) {
        const rawDate: any = slot.agenda.date;
        const datePart =
          typeof rawDate === 'string'
            ? rawDate.substring(0, 10)
            : rawDate instanceof Date
            ? rawDate.toISOString().split('T')[0]
            : null;

        if (datePart) {
          const endTimePart = slot.endTime.length === 5 ? slot.endTime + ':00' : slot.endTime;
          const slotEnd = new Date(`${datePart}T${endTimePart}`);

          if (!isNaN(slotEnd.getTime()) && slotEnd.getTime() < now.getTime()) {
            app.status = AppointmentStatus.COMPLETED;
            await this.appointmentRepository.save(app);

            if (slot.status !== TimeSlotStatus.EXPIRED) {
              slot.status = TimeSlotStatus.EXPIRED;
              await this.dataSource.getRepository(TimeSlot).save(slot);
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

  async updateStatus(id: string, status: string): Promise<Appointment> {
    const app = await this.appointmentRepository.findOne({ where: { id } });
    if (!app) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    app.status = status;
    return this.appointmentRepository.save(app);
  }
}



