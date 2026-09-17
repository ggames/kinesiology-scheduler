declare const jest: any;
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../domain/appointment.entity';
import { TimeSlot, TimeSlotStatus } from '../../agenda/time-slot/domain/time-slot.entity';

// Fecha futura para evitar rechazo por fecha pasada en tests normales
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 5);

// Fecha pasada para probar rechazos y exenciones de roles
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 5);

const mockSlotAvailable: TimeSlot = {
  id: 'slot-1',
  agenda: { id: 'agenda-1', date: futureDate } as any,
  agendaId: 'agenda-1',
  weeklySchedule: null as any,
  doctorScheduleTemplate: null as any,
  startTime: '09:00:00',
  endTime: '10:00:00',
  maxCapacity: 2,
  currentBookings: 1,
  status: TimeSlotStatus.AVAILABLE,
};

const mockSlotPast: TimeSlot = {
  ...mockSlotAvailable,
  id: 'slot-past',
  agenda: { id: 'agenda-past', date: pastDate } as any,
};

const mockSlotBlocked: TimeSlot = {
  ...mockSlotAvailable,
  id: 'slot-blocked',
  currentBookings: 2,
  status: TimeSlotStatus.BLOCKED,
};

const createDto = {
  patientId: 'patient-1',
  professionalId: 'prof-1',
  timeSlotId: 'slot-1',
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let eventEmitter: EventEmitter2;

  const buildManagerMock = (slot: TimeSlot | null) => ({
    findOne: jest.fn().mockImplementation(async () => slot ? { ...slot } : null),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockReturnValue({ id: 'appt-1', ...createDto }),
    save: jest.fn().mockImplementation(async (_target: any, entity: any) => entity),
  });

  const buildDataSourceMock = (slot: TimeSlot | null) => ({
    transaction: jest.fn().mockImplementation(async (cb: any) => {
      return cb(buildManagerMock(slot));
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: { find: jest.fn() } },
        { provide: getDataSourceToken(), useValue: buildDataSourceMock(mockSlotAvailable) },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('debe crear un turno cuando hay cupos disponibles en fecha futura', async () => {
    const result = await service.create(createDto, 'PATIENT');
    expect(result).toBeDefined();
    expect(result.id).toBe('appt-1');
  });

  it('debe emitir el evento slot.capacity.updated tras reservar', async () => {
    await service.create(createDto, 'PATIENT');
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'slot.capacity.updated',
      expect.objectContaining({ slotId: 'slot-1' }),
    );
  });

  it('debe lanzar BadRequestException al intentar reservar un turno pasado como PATIENT', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: { find: jest.fn() } },
        { provide: getDataSourceToken(), useValue: buildDataSourceMock(mockSlotPast) },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    const pastService = module.get<AppointmentsService>(AppointmentsService);
    await expect(pastService.create({ ...createDto, timeSlotId: 'slot-past' }, 'PATIENT'))
      .rejects.toThrow(BadRequestException);
  });

  it('debe PERMITIR reservar un turno pasado cuando el usuario es ADMIN o STAFF (Carga histórica)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: { find: jest.fn() } },
        { provide: getDataSourceToken(), useValue: buildDataSourceMock(mockSlotPast) },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    const pastService = module.get<AppointmentsService>(AppointmentsService);
    const result = await pastService.create({ ...createDto, timeSlotId: 'slot-past' }, 'ADMIN');
    expect(result).toBeDefined();
    expect(result.id).toBe('appt-1');
  });

  it('debe lanzar ConflictException cuando el slot está BLOCKED o reservado', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: { find: jest.fn() } },
        { provide: getDataSourceToken(), useValue: buildDataSourceMock(mockSlotBlocked) },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    const blockedService = module.get<AppointmentsService>(AppointmentsService);
    await expect(blockedService.create({ ...createDto, timeSlotId: 'slot-blocked' }, 'PATIENT'))
      .rejects.toThrow(ConflictException);
  });

  it('debe lanzar NotFoundException cuando el slot no existe', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: { find: jest.fn() } },
        { provide: getDataSourceToken(), useValue: buildDataSourceMock(null) },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    const noSlotService = module.get<AppointmentsService>(AppointmentsService);
    await expect(noSlotService.create(createDto, 'PATIENT')).rejects.toThrow(NotFoundException);
  });
});
