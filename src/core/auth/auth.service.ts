import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterProfessionalDto } from './dto/register-professional.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TokenBlacklist } from '../../modules/users/domain/token-blacklist.entity';
import { User, UserStatus } from '../../modules/users/domain/user.entity';
import { Person, Gender } from '../../modules/persons/domain/person.entity';
import { Patient } from '../../modules/patients/domain/patient.entity';
import { Professional } from '../../modules/professionals/domain/professional.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(TokenBlacklist)
    private blacklistRepo: Repository<TokenBlacklist>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Al iniciar el módulo, si la BD no posee usuarios semilla o le falta lucasfurlan@gmail.com,
   * crea/actualiza los usuarios iniciales para facilitar la autenticación inmediata.
   */
  async onModuleInit() {
    try {
      const userRepo = this.dataSource.getRepository(User);
      const personRepo = this.dataSource.getRepository(Person);
      const profRepo = this.dataSource.getRepository(Professional);
      const patientRepo = this.dataSource.getRepository(Patient);

      // Seed/ensure user lucasfurlan@gmail.com with password '1234'
      let lucasUser = await userRepo.findOne({ where: { email: 'lucasfurlan@gmail.com' } });
      const passwordHashLucas = await bcrypt.hash('1234', 10);
      if (!lucasUser) {
        lucasUser = userRepo.create({
          email: 'lucasfurlan@gmail.com',
          passwordHash: passwordHashLucas,
          role: 'ADMIN',
          roles: ['ADMIN'],
          status: UserStatus.ACTIVE,
        });
        await userRepo.save(lucasUser);
        this.logger.log('Seeded initial user: lucasfurlan@gmail.com (ADMIN)');
      } else {
        lucasUser.passwordHash = passwordHashLucas;
        lucasUser.status = UserStatus.ACTIVE;
        await userRepo.save(lucasUser);
        this.logger.log('Updated user: lucasfurlan@gmail.com credentials to 1234');
      }

      // Check standard seeds
      let adminUser = await userRepo.findOne({ where: { email: 'admin@kinesiology.com' } });
      if (!adminUser) {
        const passwordHashAdmin = await bcrypt.hash('Admin123!', 10);
        adminUser = userRepo.create({
          email: 'admin@kinesiology.com',
          passwordHash: passwordHashAdmin,
          role: 'ADMIN',
          roles: ['ADMIN'],
          status: UserStatus.ACTIVE,
        });
        await userRepo.save(adminUser);
      }

      let staffUser = await userRepo.findOne({ where: { email: 'staff@kinesiology.com' } });
      if (!staffUser) {
        const passwordHashStaff = await bcrypt.hash('Staff123!', 10);
        staffUser = userRepo.create({
          email: 'staff@kinesiology.com',
          passwordHash: passwordHashStaff,
          role: 'STAFF',
          roles: ['STAFF'],
          status: UserStatus.ACTIVE,
        });
        await userRepo.save(staffUser);
      }

      let profUser = await userRepo.findOne({ where: { email: 'kinesiologo@kinesiology.com' } });
      if (!profUser) {
        const passwordHashProf = await bcrypt.hash('Doctor123!', 10);
        profUser = userRepo.create({
          email: 'kinesiologo@kinesiology.com',
          passwordHash: passwordHashProf,
          role: 'PROFESSIONAL',
          roles: ['PROFESSIONAL'],
          status: UserStatus.ACTIVE,
        });
        const savedProfUser = await userRepo.save(profUser);

        const profPerson = personRepo.create({
          firstName: 'Carlos',
          lastName: 'Gómez',
          documentId: '99000111',
          email: 'kinesiologo@kinesiology.com',
          user: savedProfUser,
          userId: savedProfUser.id,
        });
        const savedProfPerson = await personRepo.save(profPerson);

        const profProfile = profRepo.create({
          person: savedProfPerson,
          personId: savedProfPerson.id,
          specialty: 'Kinesiología Fisiátrica',
          licenseNumber: 'MN-12345',
        });
        await profRepo.save(profProfile);
      }

      let patientUser = await userRepo.findOne({ where: { email: 'paciente@kinesiology.com' } });
      if (!patientUser) {
        const passwordHashPatient = await bcrypt.hash('Paciente123!', 10);
        patientUser = userRepo.create({
          email: 'paciente@kinesiology.com',
          passwordHash: passwordHashPatient,
          role: 'PATIENT',
          roles: ['PATIENT'],
          status: UserStatus.ACTIVE,
        });
        const savedPatientUser = await userRepo.save(patientUser);

        const patientPerson = personRepo.create({
          firstName: 'Juan',
          lastName: 'Pérez',
          documentId: '88777666',
          email: 'paciente@kinesiology.com',
          user: savedPatientUser,
          userId: savedPatientUser.id,
        });
        const savedPatientPerson = await personRepo.save(patientPerson);

        const patientProfile = patientRepo.create({
          person: savedPatientPerson,
          personId: savedPatientPerson.id,
        });
        await patientRepo.save(patientProfile);
      }

      this.logger.log('All seed accounts initialized successfully!');
    } catch (err) {
      this.logger.warn(`Could not seed initial accounts: ${(err as Error).message}`);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      return null;
    }

    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException(
        'Cuenta pendiente de activación. Por favor revise su correo para establecer su contraseña.',
      );
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException(
        'Cuenta inactiva. Por favor contacte al administrador.',
      );
    }

    if (await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      roles: user.roles || [user.role],
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        roles: user.roles || [user.role],
        status: user.status,
      },
    };
  }

  /**
   * Registro de paciente en una transacción atómica.
   * Crea usuario activo y retorna access_token JWT inmediatamente.
   */
  async registerPatient(dto: RegisterPatientDto) {
    return this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { where: { email: dto.email } });
      if (existingUser) {
        throw new ConflictException(`El correo '${dto.email}' ya se encuentra registrado`);
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userRole = dto.role || 'PATIENT';

      const user = manager.create(User, {
        email: dto.email,
        passwordHash,
        role: userRole,
        roles: [userRole],
        status: UserStatus.ACTIVE,
      });
      const savedUser = await manager.save(User, user);

      let person = await manager.findOne(Person, { where: { documentId: dto.documentId } });
      if (!person) {
        person = manager.create(Person, {
          firstName: dto.firstName,
          lastName: dto.lastName,
          documentId: dto.documentId,
          birthDate: dto.birthDate,
          gender: dto.gender || Gender.NOT_SPECIFIED,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          emergencyContactName: dto.emergencyContactName,
          emergencyContactPhone: dto.emergencyContactPhone,
          user: savedUser,
          userId: savedUser.id,
        });
        person = await manager.save(Person, person);
      } else {
        if (!person.userId) {
          person.user = savedUser;
          person.userId = savedUser.id;
          person = await manager.save(Person, person);
        }
      }

      const existingPatient = await manager.findOne(Patient, { where: { personId: person.id } });
      if (existingPatient) {
        throw new ConflictException(`Ya existe un perfil de paciente con el documento '${dto.documentId}'`);
      }

      const patient = manager.create(Patient, {
        person,
        personId: person.id,
        clinic: dto.clinicId ? ({ id: dto.clinicId } as any) : undefined,
      });
      const savedPatient = await manager.save(Patient, patient);

      const payload = { email: savedUser.email, sub: savedUser.id, role: savedUser.role, roles: [userRole] };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
          roles: savedUser.roles,
          status: savedUser.status,
        },
        person,
        patient: savedPatient,
      };
    });
  }

  async registerProfessional(dto: RegisterProfessionalDto) {
    return this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { where: { email: dto.email } });
      if (existingUser) {
        throw new ConflictException(`El correo '${dto.email}' ya se encuentra registrado`);
      }

      if (dto.licenseNumber) {
        const existingLicense = await manager.findOne(Professional, { where: { licenseNumber: dto.licenseNumber } });
        if (existingLicense) {
          throw new ConflictException(`La matrícula '${dto.licenseNumber}' ya se encuentra registrada`);
        }
      }

      const activationToken = crypto.randomBytes(32).toString('hex');
      const activationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const roles = dto.roles && dto.roles.length > 0 ? dto.roles : ['PROFESSIONAL'];
      const primaryRole = roles[0];

      const user = manager.create(User, {
        email: dto.email,
        passwordHash: '',
        role: primaryRole,
        roles,
        status: UserStatus.PENDING,
        activationToken,
        activationTokenExpiresAt,
      });
      const savedUser = await manager.save(User, user);

      let person = await manager.findOne(Person, { where: { documentId: dto.documentId } });
      if (!person) {
        person = manager.create(Person, {
          firstName: dto.firstName,
          lastName: dto.lastName,
          documentId: dto.documentId,
          email: dto.email,
          phone: dto.phone,
          user: savedUser,
          userId: savedUser.id,
        });
        person = await manager.save(Person, person);
      } else {
        if (!person.userId) {
          person.user = savedUser;
          person.userId = savedUser.id;
          person = await manager.save(Person, person);
        }
      }

      const existingProf = await manager.findOne(Professional, { where: { personId: person.id } });
      if (existingProf) {
        throw new ConflictException(`Ya existe un profesional con el documento '${dto.documentId}'`);
      }

      const professional = manager.create(Professional, {
        person,
        personId: person.id,
        specialty: dto.specialty,
        licenseNumber: dto.licenseNumber,
      });
      const savedProfessional = await manager.save(Professional, professional);

      const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      const activationLink = `${baseUrl}/activate-account?token=${activationToken}`;

      return {
        message: 'Profesional registrado con estado PENDING. Enlace de activación enviado.',
        activationToken,
        activationLink,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
          roles: savedUser.roles,
          status: savedUser.status,
          activationTokenExpiresAt: savedUser.activationTokenExpiresAt,
        },
        person,
        professional: savedProfessional,
      };
    });
  }

  async activateAccount(dto: ActivateAccountDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { activationToken: dto.token, status: UserStatus.PENDING },
      });

      if (!user) {
        throw new BadRequestException('Token de activación inválido o ya utilizado');
      }

      if (user.activationTokenExpiresAt && new Date(user.activationTokenExpiresAt) < new Date()) {
        throw new BadRequestException('El token de activación ha expirado (24h de validez)');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      user.passwordHash = passwordHash;
      user.status = UserStatus.ACTIVE;
      user.activationToken = undefined;
      user.activationTokenExpiresAt = undefined;

      const updatedUser = await manager.save(User, user);

      const payload = {
        email: updatedUser.email,
        sub: updatedUser.id,
        role: updatedUser.role,
        roles: updatedUser.roles || [updatedUser.role],
      };
      const access_token = this.jwtService.sign(payload);

      return {
        message: 'Cuenta activada exitosamente.',
        access_token,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          roles: updatedUser.roles || [updatedUser.role],
          status: updatedUser.status,
        },
      };
    });
  }

  async refresh(user: { email: string; userId: string; role: string }) {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string) {
    const decoded: any = this.jwtService.decode(token);
    if (decoded && decoded.exp) {
      await this.blacklistRepo.save({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const found = await this.blacklistRepo.findOne({ where: { token } });
    return !!found;
  }

  async getProfile(userId: string) {
    const userRepo = this.dataSource.getRepository(User);
    const personRepo = this.dataSource.getRepository(Person);
    const patientRepo = this.dataSource.getRepository(Patient);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const person = await personRepo.findOne({ where: { userId } });
    let patient: Patient | null = null;
    if (person) {
      patient = await patientRepo.findOne({
        where: { personId: person.id },
        relations: { obraSocial: true, prepaga: true, healthInsurance: true },
      });
    }

    return {
      id: patient?.id || user.id,
      email: user.email,
      firstName: person?.firstName || '',
      lastName: person?.lastName || '',
      documentId: person?.documentId || '',
      phone: person?.phone || '',
      obraSocial: patient?.obraSocial?.name || patient?.healthInsurance?.name || '',
      nroAfiliado: '',
      role: user.role,
      roles: user.roles || [user.role],
    };
  }

  async updateProfile(userId: string, dto: any) {
    const personRepo = this.dataSource.getRepository(Person);
    let person = await personRepo.findOne({ where: { userId } });
    if (person) {
      if (dto.firstName) person.firstName = dto.firstName;
      if (dto.lastName) person.lastName = dto.lastName;
      if (dto.phone) person.phone = dto.phone;
      await personRepo.save(person);
    }
    return this.getProfile(userId);
  }

  async changePassword(userId: string, dto: { currentPassword?: string; newPassword?: string }) {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (dto.currentPassword && dto.newPassword) {
      const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!isValid) {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }
      user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
      await userRepo.save(user);
    }
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
