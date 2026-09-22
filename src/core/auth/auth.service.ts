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
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordPhoneDto } from './dto/reset-password-phone.dto';
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
          roles: ['ADMIN', 'PATIENT'],
          status: UserStatus.ACTIVE,
        });
        await userRepo.save(lucasUser);
        this.logger.log('Seeded initial user: lucasfurlan@gmail.com (ADMIN, PATIENT)');
      } else {
        lucasUser.passwordHash = passwordHashLucas;
        lucasUser.status = UserStatus.ACTIVE;
        const r = lucasUser.roles || [lucasUser.role || 'ADMIN'];
        if (!r.includes('PATIENT')) r.push('PATIENT');
        lucasUser.roles = [...new Set(r)];
        await userRepo.save(lucasUser);
        this.logger.log('Updated user: lucasfurlan@gmail.com credentials to 1234 (ADMIN, PATIENT)');
      }

      // Seed/ensure Person for lucasfurlan@gmail.com
      let lucasPerson = await personRepo.findOne({ where: { userId: lucasUser.id } });
      if (!lucasPerson) {
        lucasPerson = await personRepo.findOne({ where: { email: 'lucasfurlan@gmail.com' } });
      }
      if (!lucasPerson) {
        lucasPerson = personRepo.create({
          firstName: 'Lucas',
          lastName: 'Furlan',
          documentId: '11223344',
          email: 'lucasfurlan@gmail.com',
          user: lucasUser,
          userId: lucasUser.id,
        });
        await personRepo.save(lucasPerson);
      } else if (!lucasPerson.userId) {
        lucasPerson.userId = lucasUser.id;
        lucasPerson.user = lucasUser;
        await personRepo.save(lucasPerson);
      }

      let lucasPatient = await patientRepo.findOne({ where: { personId: lucasPerson.id } });
      if (!lucasPatient) {
        lucasPatient = patientRepo.create({
          person: lucasPerson,
          personId: lucasPerson.id,
        });
        await patientRepo.save(lucasPatient);
      }

      // Check standard seeds
      let adminUser = await userRepo.findOne({ where: { email: 'admin@kinesiology.com' } });
      if (!adminUser) {
        const passwordHashAdmin = await bcrypt.hash('Admin123!', 10);
        adminUser = userRepo.create({
          email: 'admin@kinesiology.com',
          passwordHash: passwordHashAdmin,
          role: 'ADMIN',
          roles: ['ADMIN', 'PATIENT'],
          status: UserStatus.ACTIVE,
        });
        await userRepo.save(adminUser);
      } else {
        const r = adminUser.roles || [adminUser.role || 'ADMIN'];
        if (!r.includes('PATIENT')) r.push('PATIENT');
        adminUser.roles = [...new Set(r)];
        await userRepo.save(adminUser);
      }

      let adminPerson = await personRepo.findOne({ where: { userId: adminUser.id } });
      if (!adminPerson) {
        adminPerson = await personRepo.findOne({ where: { email: 'admin@kinesiology.com' } });
      }
      if (!adminPerson) {
        adminPerson = personRepo.create({
          firstName: 'Admin',
          lastName: 'Sistema',
          documentId: '00000001',
          email: 'admin@kinesiology.com',
          user: adminUser,
          userId: adminUser.id,
        });
        await personRepo.save(adminPerson);
      } else if (!adminPerson.userId) {
        adminPerson.userId = adminUser.id;
        adminPerson.user = adminUser;
        await personRepo.save(adminPerson);
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

      let staffPerson = await personRepo.findOne({ where: { userId: staffUser.id } });
      if (!staffPerson) {
        staffPerson = await personRepo.findOne({ where: { email: 'staff@kinesiology.com' } });
      }
      if (!staffPerson) {
        staffPerson = personRepo.create({
          firstName: 'Staff',
          lastName: 'Recepción',
          documentId: '00000002',
          email: 'staff@kinesiology.com',
          user: staffUser,
          userId: staffUser.id,
        });
        await personRepo.save(staffPerson);
      } else if (!staffPerson.userId) {
        staffPerson.userId = staffUser.id;
        staffPerson.user = staffUser;
        await personRepo.save(staffPerson);
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
        const passwordHashPatient = await bcrypt.hash(' ', 10);
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
    
    
    this.logger.log("Usuario " + JSON.stringify(user));
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
 
    const rawRoles: string[] = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    const rolesSet = new Set(rawRoles);
    if (rawRoles.includes('ADMIN') || rawRoles.includes('PATIENT') || user.role === 'ADMIN' || user.role === 'PATIENT') {
      rolesSet.add('PATIENT');
    }
    const roles = Array.from(rolesSet);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      roles: roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        roles: roles,
        status: user.status,
        fotoPerfilUrl: user.fotoPerfilUrl,
      },
    };
  }

  /**
   * Verifica si una persona con el DNI proporcionado ya se encuentra en la base de datos.
   */
  async checkDocument(documentId: string) {
    const cleanDni = documentId ? documentId.trim() : '';
    if (!cleanDni) {
      return { exists: false };
    }

    const personRepo = this.dataSource.getRepository(Person);
    const userRepo = this.dataSource.getRepository(User);
    const patientRepo = this.dataSource.getRepository(Patient);

    const person = await personRepo.findOne({
      where: { documentId: cleanDni },
      relations: { user: true, patient: true },
    });

    if (!person) {
      return { exists: false };
    }

    let user: User | undefined = person.user ?? undefined;
    if (!user && person.userId) {
      user = (await userRepo.findOne({ where: { id: person.userId } })) ?? undefined;
    }
    if (!user && person.email) {
      user = (await userRepo.findOne({ where: { email: person.email } })) ?? undefined;
    }

    let patient: Patient | undefined = person.patient ?? undefined;
    if (!patient) {
      patient = (await patientRepo.findOne({ where: { personId: person.id } })) ?? undefined;
    }

    const roles = user ? (user.roles && user.roles.length > 0 ? user.roles : [user.role]) : [];
    const hasPatientRole = roles.includes('PATIENT');
    const hasPatientProfile = !!patient;

    return {
      exists: true,
      person: {
        firstName: person.firstName,
        lastName: person.lastName,
        documentId: person.documentId,
        email: person.email || user?.email || '',
        phone: person.phone || '',
        address: person.address || '',
        birthDate: person.birthDate || '',
        gender: person.gender || '',
      },
      hasUser: !!user,
      hasPatientProfile,
      hasPatientRole,
      roles,
    };
  }

  /**
   * Registro de paciente en una transacción atómica.
   * Crea usuario activo y retorna access_token JWT inmediatamente.
   * Si ya existe un usuario con rol STAFF, PROFESSIONAL o ADMIN sin rol PATIENT, le añade el rol PATIENT.
   */
  async registerPatient(dto: RegisterPatientDto) {
    return this.dataSource.transaction(async (manager) => {
      const cleanDni = dto.documentId ? dto.documentId.trim() : '';
      const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : '';

      // 1. Buscar si ya existe la persona por DNI o el usuario por email
      let person = await manager.findOne(Person, { where: { documentId: cleanDni } });

      let existingUser: User | null = null;
      if (person && person.userId) {
        existingUser = await manager.findOne(User, { where: { id: person.userId } });
      }
      if (!existingUser) {
        existingUser = await manager.findOne(User, { where: { email: cleanEmail } });
      }

      // Si el usuario ya existe en el sistema
      if (existingUser) {
        const roles = existingUser.roles && existingUser.roles.length > 0 ? existingUser.roles : [existingUser.role];
        const existingPatient = person ? await manager.findOne(Patient, { where: { personId: person.id } }) : null;

        // Si ya tiene perfil de paciente Y rol de paciente: rechazar duplicado
        if (roles.includes('PATIENT') && existingPatient) {
          throw new ConflictException(`El DNI o correo '${cleanDni}' ya se encuentra registrado como Paciente`);
        }

        // Si el usuario tiene otro rol (STAFF, PROFESSIONAL, ADMIN, etc.) y NO tiene rol PATIENT
        if (!roles.includes('PATIENT')) {
          roles.push('PATIENT');
          existingUser.roles = [...new Set(roles)];
          await manager.save(User, existingUser);
        }

        // Vincular persona al usuario si no estaba vinculada
        if (!person) {
          person = manager.create(Person, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            documentId: cleanDni,
            birthDate: dto.birthDate,
            gender: dto.gender || Gender.NOT_SPECIFIED,
            phone: dto.phone,
            email: cleanEmail,
            address: dto.address,
            user: existingUser,
            userId: existingUser.id,
          });
          person = await manager.save(Person, person);
        } else {
          if (dto.firstName) person.firstName = dto.firstName;
          if (dto.lastName) person.lastName = dto.lastName;
          if (dto.phone) person.phone = dto.phone;
          if (!person.userId) {
            person.user = existingUser;
            person.userId = existingUser.id;
          }
          person = await manager.save(Person, person);
        }

        // Crear perfil de paciente si no existe
        let patient = await manager.findOne(Patient, { where: { personId: person.id } });
        if (!patient) {
          patient = manager.create(Patient, {
            person,
            personId: person.id,
            clinic: dto.clinicId ? ({ id: dto.clinicId } as any) : undefined,
          });
          patient = await manager.save(Patient, patient);
        }

        const payload = {
          email: existingUser.email,
          sub: existingUser.id,
          role: existingUser.role,
          roles: existingUser.roles,
        };
        const access_token = this.jwtService.sign(payload);

        return {
          access_token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            roles: existingUser.roles,
            status: existingUser.status,
          },
          person,
          patient,
          message: 'Se ha asignado el rol de Paciente a su cuenta existente.',
        };
      }

      // 2. Si no existe ningún usuario previo, crear cuenta de usuario nueva
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userRole = dto.role || 'PATIENT';

      const user = manager.create(User, {
        email: cleanEmail,
        passwordHash,
        role: userRole,
        roles: [userRole],
        status: UserStatus.ACTIVE,
      });
      const savedUser = await manager.save(User, user);

      if (!person) {
        person = manager.create(Person, {
          firstName: dto.firstName,
          lastName: dto.lastName,
          documentId: cleanDni,
          birthDate: dto.birthDate,
          gender: dto.gender || Gender.NOT_SPECIFIED,
          phone: dto.phone,
          email: cleanEmail,
          address: dto.address,
          user: savedUser,
          userId: savedUser.id,
        });
        person = await manager.save(Person, person);
      } else {
        person.user = savedUser;
        person.userId = savedUser.id;
        person = await manager.save(Person, person);
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

  async refresh(user: { email: string; userId: string; role: string; roles?: string[] }) {
    const payload = { email: user.email, sub: user.userId, role: user.role, roles: user.roles || [user.role] };
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

    let person = await personRepo.findOne({ where: { userId } });
    if (!person && user.email) {
      person = await personRepo.findOne({ where: { email: user.email } });
      if (person && !person.userId) {
        person.userId = user.id;
        person.user = user;
        await personRepo.save(person);
      }
    }

    let patient: Patient | null = null;
    if (person) {
      patient = await patientRepo.findOne({
        where: { personId: person.id },
        relations: { obraSocial: true, prepaga: true, healthInsurance: true },
      });
    }

    const rawRoles: string[] = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    const rolesSet = new Set(rawRoles);
    if (rawRoles.includes('ADMIN') || rawRoles.includes('PATIENT') || user.role === 'ADMIN' || user.role === 'PATIENT') {
      rolesSet.add('PATIENT');
    }
    const roles = Array.from(rolesSet);

    return {
      id: patient?.id || user.id,
      userId: user.id,
      email: user.email,
      firstName: person?.firstName || '',
      lastName: person?.lastName || '',
      documentId: person?.documentId || '',
      phone: person?.phone || '',
      address: person?.address || '',
      birthDate: person?.birthDate || '',
      gender: person?.gender || '',
      emergencyContactName: person?.emergencyContactName || '',
      emergencyContactPhone: person?.emergencyContactPhone || '',
      obraSocial: patient?.obraSocial?.name || patient?.healthInsurance?.name || '',
      nroAfiliado: '',
      role: user.role,
      roles: roles,
      fotoPerfilUrl: user.fotoPerfilUrl || '',
      person: person
        ? {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            documentId: person.documentId,
            birthDate: person.birthDate,
            gender: person.gender,
            phone: person.phone,
            email: person.email,
            address: person.address,
            emergencyContactName: person.emergencyContactName,
            emergencyContactPhone: person.emergencyContactPhone,
            userId: person.userId,
          }
        : null,
    };
  }

  async updateProfile(userId: string, dto: any) {
    const userRepo = this.dataSource.getRepository(User);
    const personRepo = this.dataSource.getRepository(Person);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const nuevaFoto = dto.fotoPerfilUrl || dto.avatarUrl;
    if (nuevaFoto !== undefined) {
      user.fotoPerfilUrl = nuevaFoto;
      await userRepo.save(user);
    }

    let person = await personRepo.findOne({ where: { userId } });
    if (!person && user.email) {
      person = await personRepo.findOne({ where: { email: user.email } });
      if (person) {
        person.userId = user.id;
        person.user = user;
      }
    }

    // Si no existe persona asociada, crear la persona para este usuario
    if (!person) {
      const documentId =
        dto.documentId || dto.dni || dto.documento || `DNI-${user.id.substring(0, 8)}`;
      person = personRepo.create({
        firstName: dto.firstName || dto.nombre || user.email.split('@')[0],
        lastName: dto.lastName || dto.apellido || '',
        documentId: documentId,
        email: user.email,
        phone: dto.phone || dto.telefono || '',
        address: dto.address || dto.direccion || '',
        birthDate: dto.birthDate || dto.fechaNacimiento || undefined,
        gender: dto.gender || Gender.NOT_SPECIFIED,
        emergencyContactName: dto.emergencyContactName || undefined,
        emergencyContactPhone: dto.emergencyContactPhone || undefined,
        user: user,
        userId: user.id,
      });
    } else {
      // Si ya existe la persona, actualizar datos provistos y completar faltantes
      if (dto.firstName || dto.nombre) person.firstName = dto.firstName || dto.nombre;
      if (dto.lastName || dto.apellido) person.lastName = dto.lastName || dto.apellido;
      if (dto.documentId || dto.dni || dto.documento)
        person.documentId = dto.documentId || dto.dni || dto.documento;
      if (dto.phone || dto.telefono) person.phone = dto.phone || dto.telefono;
      if (dto.address || dto.direccion) person.address = dto.address || dto.direccion;
      if (dto.birthDate || dto.fechaNacimiento)
        person.birthDate = dto.birthDate || dto.fechaNacimiento;
      if (dto.gender) person.gender = dto.gender;
      if (dto.emergencyContactName) person.emergencyContactName = dto.emergencyContactName;
      if (dto.emergencyContactPhone) person.emergencyContactPhone = dto.emergencyContactPhone;
      if (!person.userId) person.userId = user.id;
      if (!person.email) person.email = user.email;
    }

    await personRepo.save(person);

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

  // ─────────────────────────────────────────────────────────────────────────────
  // OTP — Recuperación de contraseña por teléfono
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Paso 1: Recibe el número de teléfono, genera un OTP de 6 dígitos,
   * lo guarda hasheado en el usuario con TTL de 10 minutos y lo "envía" por SMS.
   * En modo DEV el código se imprime en consola. Para producción: integrar Twilio.
   */
  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const personRepo = this.dataSource.getRepository(Person);
    const userRepo = this.dataSource.getRepository(User);

    const phone = dto.phone.trim();
    const person = await personRepo.findOne({ where: { phone } });
    if (!person) {
      // Por seguridad respondemos siempre OK aunque no exista el teléfono
      this.logger.warn(`requestPasswordReset: teléfono no encontrado: ${phone}`);
      return { message: 'Si el número está registrado, recibirás un código en instantes.' };
    }

    const user = await userRepo.findOne({ where: { id: person.userId } });
    if (!user) {
      return { message: 'Si el número está registrado, recibirás un código en instantes.' };
    }

    // Generar código OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    user.otpCode = otpHash;
    user.otpExpiresAt = expiresAt;
    await userRepo.save(user);

    // TODO producción: reemplazar este log por llamada a Twilio/Vonage
    this.logger.log(`[DEV] OTP para ${phone}: ${otp} (válido hasta ${expiresAt.toISOString()})`);

    return { message: 'Si el número está registrado, recibirás un código en instantes.' };
  }

  /**
   * Paso 2 (opcional): Valida el OTP sin cambiar la contraseña.
   * Útil para mostrar la pantalla de nueva contraseña solo si el código es correcto.
   * Devuelve un token temporal de un solo uso para el paso 3.
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const personRepo = this.dataSource.getRepository(Person);
    const userRepo = this.dataSource.getRepository(User);

    const phone = dto.phone.trim();
    const person = await personRepo.findOne({ where: { phone } });
    if (!person) throw new BadRequestException('Código inválido o expirado.');

    const user = await userRepo.findOne({ where: { id: person.userId } });
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new BadRequestException('Código inválido o expirado.');
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpCode = null;
      user.otpExpiresAt = null;
      await userRepo.save(user);
      throw new BadRequestException('El código ha expirado. Solicitá uno nuevo.');
    }

    const valid = await bcrypt.compare(dto.code, user.otpCode);
    if (!valid) throw new BadRequestException('Código inválido o expirado.');

    // Generar token temporal firmado (60 segundos) para autorizar el reset
    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password-reset' },
      { expiresIn: '5m' },
    );

    return { valid: true, resetToken };
  }

  /**
   * Paso 3: Valida el OTP (o resetToken) y actualiza la contraseña.
   * El OTP queda invalidado tras el primer uso exitoso.
   */
  async resetPasswordByPhone(dto: ResetPasswordPhoneDto) {
    const personRepo = this.dataSource.getRepository(Person);
    const userRepo = this.dataSource.getRepository(User);

    const phone = dto.phone.trim();
    const person = await personRepo.findOne({ where: { phone } });
    if (!person) throw new BadRequestException('Código inválido o expirado.');

    const user = await userRepo.findOne({ where: { id: person.userId } });
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new BadRequestException('Código inválido o expirado.');
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpCode = null;
      user.otpExpiresAt = null;
      await userRepo.save(user);
      throw new BadRequestException('El código ha expirado. Solicitá uno nuevo.');
    }

    const valid = await bcrypt.compare(dto.code, user.otpCode);
    if (!valid) throw new BadRequestException('Código inválido o expirado.');

    // Actualizar contraseña e invalidar OTP
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.otpCode = null;
    user.otpExpiresAt = null;
    await userRepo.save(user);

    this.logger.log(`Contraseña restablecida exitosamente para usuario id=${user.id}`);
    return { message: 'Contraseña restablecida correctamente. Ya podés iniciar sesión.' };
  }
}
