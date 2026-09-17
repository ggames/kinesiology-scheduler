declare const jest: any;
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../../modules/users/application/users.service';
import { TokenBlacklist } from '../../modules/users/domain/token-blacklist.entity';
import { UserStatus } from '../../modules/users/domain/user.entity';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'user-1',
  email: 'kine@test.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  role: 'PROFESSIONAL',
  status: UserStatus.ACTIVE,
};

/** Mock de ConfigService reutilizable en todos los TestingModule del archivo. */
const mockConfigService = {
  provide: ConfigService,
  useValue: {
    get: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        APP_URL: 'http://localhost:3000',
        JWT_SECRET: 'test-secret',
        FRONTEND_URL: 'http://localhost:4200',
      };
      return config[key];
    }),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const buildManagerMock = (existingUser: any = null, existingPatient: any = null) => ({
    findOne: jest.fn().mockImplementation(async (entity: any, options: any) => {
      if (options?.where?.email && existingUser) return existingUser;
      if (options?.where?.documentId && existingPatient) return existingPatient;
      if (options?.where?.activationToken) return existingUser;
      return null;
    }),
    create: jest.fn().mockImplementation((_target: any, dto: any) => ({ id: 'gen-id', ...dto })),
    save: jest.fn().mockImplementation(async (_target: any, entity: any) => entity),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn().mockResolvedValue(mockUser) },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
            decode: jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }),
          },
        },
        mockConfigService,
        {
          provide: getRepositoryToken(TokenBlacklist),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: getDataSourceToken(),
          useValue: {
            transaction: jest.fn().mockImplementation(async (cb: any) => {
              return cb(buildManagerMock());
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('debe retornar un access_token con credenciales válidas', async () => {
      const result = await service.login({ email: 'kine@test.com', password: 'password123' });
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock.jwt.token');
    });

    it('debe lanzar UnauthorizedException con contraseña incorrecta', async () => {
      await expect(service.login({ email: 'kine@test.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerPatient', () => {
    it('debe crear un usuario y perfil de paciente dentro de una transacción', async () => {
      const registerDto = {
        email: 'nuevo@paciente.com',
        password: 'password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        documentId: '99887766',
      };
      const result = await service.registerPatient(registerDto);
      expect(result).toHaveProperty('access_token');
      expect(result.user).toBeDefined();
      expect(result.user.role).toBe('PATIENT');
      expect(result.person).toBeDefined();
      expect(result.person.firstName).toBe('Juan');
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      const customModule: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: UsersService, useValue: { findByEmail: jest.fn() } },
          { provide: JwtService, useValue: { sign: jest.fn() } },
          mockConfigService,
          { provide: getRepositoryToken(TokenBlacklist), useValue: {} },
          {
            provide: getDataSourceToken(),
            useValue: {
              transaction: jest.fn().mockImplementation(async (cb: any) => {
                return cb(buildManagerMock({ id: 'u1', email: 'existe@test.com' }, null));
              }),
            },
          },
        ],
      }).compile();

      const customService = customModule.get<AuthService>(AuthService);
      await expect(
        customService.registerPatient({
          email: 'existe@test.com',
          password: 'password123',
          firstName: 'Juan',
          lastName: 'Pérez',
          documentId: '12345678',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('registerProfessional', () => {
    it('debe registrar un profesional en estado PENDING y generar un token de activación de 24h', async () => {
      const dto = {
        email: 'profesional@test.com',
        firstName: 'Carlos',
        lastName: 'Gómez',
        documentId: '28765432',
        licenseNumber: 'MP-9988',
        specialty: 'Traumatología',
        roles: ['PROFESSIONAL', 'ADMIN'],
      };
      const result = await service.registerProfessional(dto);
      expect(result).toHaveProperty('activationToken');
      expect(result).toHaveProperty('activationLink');
      expect(result.user.status).toBe(UserStatus.PENDING);
      expect(result.professional.licenseNumber).toBe('MP-9988');
    });
  });

  describe('activateAccount', () => {
    it('debe activar la cuenta PENDING y retornar un access_token', async () => {
      const pendingUser = {
        id: 'u-pending',
        email: 'prof@test.com',
        role: 'PROFESSIONAL',
        roles: ['PROFESSIONAL'],
        status: UserStatus.PENDING,
        activationToken: 'token-valido',
        activationTokenExpiresAt: new Date(Date.now() + 3600000), // En 1 hora
      };

      const customModule: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: UsersService, useValue: { findByEmail: jest.fn() } },
          {
            provide: JwtService,
            useValue: { sign: jest.fn().mockReturnValue('token-activado') },
          },
          mockConfigService,
          { provide: getRepositoryToken(TokenBlacklist), useValue: {} },
          {
            provide: getDataSourceToken(),
            useValue: {
              transaction: jest.fn().mockImplementation(async (cb: any) => {
                return cb(buildManagerMock(pendingUser));
              }),
            },
          },
        ],
      }).compile();

      const customService = customModule.get<AuthService>(AuthService);
      const result = await customService.activateAccount({
        token: 'token-valido',
        password: 'NuevaPassword123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.user.status).toBe(UserStatus.ACTIVE);
    });

    it('debe lanzar BadRequestException si el token expiró', async () => {
      const expiredUser = {
        id: 'u-expired',
        email: 'prof@test.com',
        role: 'PROFESSIONAL',
        status: UserStatus.PENDING,
        activationToken: 'token-expiro',
        activationTokenExpiresAt: new Date(Date.now() - 3600000), // Expiró hace 1 hora
      };

      const customModule: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: UsersService, useValue: { findByEmail: jest.fn() } },
          { provide: JwtService, useValue: { sign: jest.fn() } },
          mockConfigService,
          { provide: getRepositoryToken(TokenBlacklist), useValue: {} },
          {
            provide: getDataSourceToken(),
            useValue: {
              transaction: jest.fn().mockImplementation(async (cb: any) => {
                return cb(buildManagerMock(expiredUser));
              }),
            },
          },
        ],
      }).compile();

      const customService = customModule.get<AuthService>(AuthService);
      await expect(
        customService.activateAccount({
          token: 'token-expiro',
          password: 'NuevaPassword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refresh', () => {
    it('debe retornar un nuevo access_token usando los datos del usuario', async () => {
      const result = await service.refresh({
        email: 'kine@test.com',
        userId: 'user-1',
        role: 'PROFESSIONAL',
      });
      expect(result).toHaveProperty('access_token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'kine@test.com',
        sub: 'user-1',
        role: 'PROFESSIONAL',
      });
    });
  });

  describe('isTokenBlacklisted', () => {
    it('debe retornar false cuando el token no está en el blacklist', async () => {
      const result = await service.isTokenBlacklisted('any-token');
      expect(result).toBe(false);
    });
  });
});
