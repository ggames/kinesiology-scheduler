import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { CalendarGeneratorService } from './calendar-generator.service';
import { DoctorScheduleTemplate } from '../../doctor-schedule-template/domain/doctor-schedule-template.entity';
import { DailyAgenda } from '../../daily-agenda/domain/daily-agenda.entity';
import { TimeSlot } from '../../time-slot/domain/time-slot.entity';
import { Holiday } from '../../holiday/domain/holiday.entity';
import { Professional } from '../../../professionals/domain/professional.entity';
import { Clinic } from '../../clinic/domain/clinic.entity';
import { WeeklySchedule } from '../../weekly-schedule/domain/weekly-schedule.entity';

describe('CalendarGeneratorService', () => {
  let service: CalendarGeneratorService;

  const mockProf = { id: 'prof-1' };
  const mockClinic = { id: 'clinic-1', name: 'Clínica Central de Kinesiología' };

  const queryRunnerMock = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((_entity: any, dto: any) => ({ id: 'gen-id', ...dto })),
      save: jest.fn().mockImplementation(async (_entity: any, entity: any) => entity),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarGeneratorService,
        {
          provide: getRepositoryToken(DoctorScheduleTemplate),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
            create: jest.fn().mockImplementation((dto: any) => ({ id: 'tpl-id', ...dto })),
            save: jest.fn().mockImplementation(async (entities: any) => entities),
          },
        },
        {
          provide: getRepositoryToken(DailyAgenda),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: getRepositoryToken(TimeSlot),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: getRepositoryToken(Holiday),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: getRepositoryToken(Professional),
          useValue: { find: jest.fn().mockResolvedValue([mockProf]) },
        },
        {
          provide: getRepositoryToken(Clinic),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockClinic),
            create: jest.fn().mockImplementation((dto: any) => ({ id: 'clinic-1', ...dto })),
            save: jest.fn().mockImplementation(async (entity: any) => entity),
          },
        },
        {
          provide: getRepositoryToken(WeeklySchedule),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
            create: jest.fn().mockImplementation((dto: any) => ({ id: 'ws-id', ...dto })),
            save: jest.fn().mockImplementation(async (entities: any) => entities),
          },
        },
        {
          provide: getDataSourceToken(),
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
          },
        },
      ],
    }).compile();

    service = module.get<CalendarGeneratorService>(CalendarGeneratorService);
  });

  it('debe inicializarse y sembrar plantillas/agendas de 2 meses al ejecutarse onModuleInit', async () => {
    await service.onModuleInit();
    expect(service).toBeDefined();
  });

  it('debe generar ventana deslizante de 60 días para los profesionales', async () => {
    const result = await service.generateRollingWindowFor60Days();
    expect(result).toBeDefined();
    expect(result.professionalsProcessed).toBe(1);
    expect(result.startDate).toBeDefined();
    expect(result.endDate).toBeDefined();
  });
});
