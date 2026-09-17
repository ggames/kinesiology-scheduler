"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../modules/users/application/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_blacklist_entity_1 = require("../../modules/users/domain/token-blacklist.entity");
const user_entity_1 = require("../../modules/users/domain/user.entity");
const person_entity_1 = require("../../modules/persons/domain/person.entity");
const patient_entity_1 = require("../../modules/patients/domain/patient.entity");
const professional_entity_1 = require("../../modules/professionals/domain/professional.entity");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    configService;
    blacklistRepo;
    dataSource;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, configService, blacklistRepo, dataSource) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.blacklistRepo = blacklistRepo;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        try {
            const userRepo = this.dataSource.getRepository(user_entity_1.User);
            const personRepo = this.dataSource.getRepository(person_entity_1.Person);
            const profRepo = this.dataSource.getRepository(professional_entity_1.Professional);
            const patientRepo = this.dataSource.getRepository(patient_entity_1.Patient);
            let lucasUser = await userRepo.findOne({ where: { email: 'lucasfurlan@gmail.com' } });
            const passwordHashLucas = await bcrypt.hash('1234', 10);
            if (!lucasUser) {
                lucasUser = userRepo.create({
                    email: 'lucasfurlan@gmail.com',
                    passwordHash: passwordHashLucas,
                    role: 'ADMIN',
                    roles: ['ADMIN'],
                    status: user_entity_1.UserStatus.ACTIVE,
                });
                await userRepo.save(lucasUser);
                this.logger.log('Seeded initial user: lucasfurlan@gmail.com (ADMIN)');
            }
            else {
                lucasUser.passwordHash = passwordHashLucas;
                lucasUser.status = user_entity_1.UserStatus.ACTIVE;
                await userRepo.save(lucasUser);
                this.logger.log('Updated user: lucasfurlan@gmail.com credentials to 1234');
            }
            let adminUser = await userRepo.findOne({ where: { email: 'admin@kinesiology.com' } });
            if (!adminUser) {
                const passwordHashAdmin = await bcrypt.hash('Admin123!', 10);
                adminUser = userRepo.create({
                    email: 'admin@kinesiology.com',
                    passwordHash: passwordHashAdmin,
                    role: 'ADMIN',
                    roles: ['ADMIN'],
                    status: user_entity_1.UserStatus.ACTIVE,
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
                    status: user_entity_1.UserStatus.ACTIVE,
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
                    status: user_entity_1.UserStatus.ACTIVE,
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
                    status: user_entity_1.UserStatus.ACTIVE,
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
        }
        catch (err) {
            this.logger.warn(`Could not seed initial accounts: ${err.message}`);
        }
    }
    async validateUser(email, pass) {
        const normalizedEmail = email ? email.trim().toLowerCase() : '';
        const user = await this.usersService.findByEmail(normalizedEmail);
        if (!user) {
            return null;
        }
        if (user.status === user_entity_1.UserStatus.PENDING) {
            throw new common_1.UnauthorizedException('Cuenta pendiente de activación. Por favor revise su correo para establecer su contraseña.');
        }
        if (user.status === user_entity_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException('Cuenta inactiva. Por favor contacte al administrador.');
        }
        if (await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash: _passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
    async registerPatient(dto) {
        return this.dataSource.transaction(async (manager) => {
            const existingUser = await manager.findOne(user_entity_1.User, { where: { email: dto.email } });
            if (existingUser) {
                throw new common_1.ConflictException(`El correo '${dto.email}' ya se encuentra registrado`);
            }
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const userRole = dto.role || 'PATIENT';
            const user = manager.create(user_entity_1.User, {
                email: dto.email,
                passwordHash,
                role: userRole,
                roles: [userRole],
                status: user_entity_1.UserStatus.ACTIVE,
            });
            const savedUser = await manager.save(user_entity_1.User, user);
            let person = await manager.findOne(person_entity_1.Person, { where: { documentId: dto.documentId } });
            if (!person) {
                person = manager.create(person_entity_1.Person, {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    documentId: dto.documentId,
                    birthDate: dto.birthDate,
                    gender: dto.gender || person_entity_1.Gender.NOT_SPECIFIED,
                    phone: dto.phone,
                    email: dto.email,
                    address: dto.address,
                    emergencyContactName: dto.emergencyContactName,
                    emergencyContactPhone: dto.emergencyContactPhone,
                    user: savedUser,
                    userId: savedUser.id,
                });
                person = await manager.save(person_entity_1.Person, person);
            }
            else {
                if (!person.userId) {
                    person.user = savedUser;
                    person.userId = savedUser.id;
                    person = await manager.save(person_entity_1.Person, person);
                }
            }
            const existingPatient = await manager.findOne(patient_entity_1.Patient, { where: { personId: person.id } });
            if (existingPatient) {
                throw new common_1.ConflictException(`Ya existe un perfil de paciente con el documento '${dto.documentId}'`);
            }
            const patient = manager.create(patient_entity_1.Patient, {
                person,
                personId: person.id,
                clinic: dto.clinicId ? { id: dto.clinicId } : undefined,
            });
            const savedPatient = await manager.save(patient_entity_1.Patient, patient);
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
    async registerProfessional(dto) {
        return this.dataSource.transaction(async (manager) => {
            const existingUser = await manager.findOne(user_entity_1.User, { where: { email: dto.email } });
            if (existingUser) {
                throw new common_1.ConflictException(`El correo '${dto.email}' ya se encuentra registrado`);
            }
            if (dto.licenseNumber) {
                const existingLicense = await manager.findOne(professional_entity_1.Professional, { where: { licenseNumber: dto.licenseNumber } });
                if (existingLicense) {
                    throw new common_1.ConflictException(`La matrícula '${dto.licenseNumber}' ya se encuentra registrada`);
                }
            }
            const activationToken = crypto.randomBytes(32).toString('hex');
            const activationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const roles = dto.roles && dto.roles.length > 0 ? dto.roles : ['PROFESSIONAL'];
            const primaryRole = roles[0];
            const user = manager.create(user_entity_1.User, {
                email: dto.email,
                passwordHash: '',
                role: primaryRole,
                roles,
                status: user_entity_1.UserStatus.PENDING,
                activationToken,
                activationTokenExpiresAt,
            });
            const savedUser = await manager.save(user_entity_1.User, user);
            let person = await manager.findOne(person_entity_1.Person, { where: { documentId: dto.documentId } });
            if (!person) {
                person = manager.create(person_entity_1.Person, {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    documentId: dto.documentId,
                    email: dto.email,
                    phone: dto.phone,
                    user: savedUser,
                    userId: savedUser.id,
                });
                person = await manager.save(person_entity_1.Person, person);
            }
            else {
                if (!person.userId) {
                    person.user = savedUser;
                    person.userId = savedUser.id;
                    person = await manager.save(person_entity_1.Person, person);
                }
            }
            const existingProf = await manager.findOne(professional_entity_1.Professional, { where: { personId: person.id } });
            if (existingProf) {
                throw new common_1.ConflictException(`Ya existe un profesional con el documento '${dto.documentId}'`);
            }
            const professional = manager.create(professional_entity_1.Professional, {
                person,
                personId: person.id,
                specialty: dto.specialty,
                licenseNumber: dto.licenseNumber,
            });
            const savedProfessional = await manager.save(professional_entity_1.Professional, professional);
            const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
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
    async activateAccount(dto) {
        return this.dataSource.transaction(async (manager) => {
            const user = await manager.findOne(user_entity_1.User, {
                where: { activationToken: dto.token, status: user_entity_1.UserStatus.PENDING },
            });
            if (!user) {
                throw new common_1.BadRequestException('Token de activación inválido o ya utilizado');
            }
            if (user.activationTokenExpiresAt && new Date(user.activationTokenExpiresAt) < new Date()) {
                throw new common_1.BadRequestException('El token de activación ha expirado (24h de validez)');
            }
            const passwordHash = await bcrypt.hash(dto.password, 10);
            user.passwordHash = passwordHash;
            user.status = user_entity_1.UserStatus.ACTIVE;
            user.activationToken = undefined;
            user.activationTokenExpiresAt = undefined;
            const updatedUser = await manager.save(user_entity_1.User, user);
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
    async refresh(user) {
        const payload = { email: user.email, sub: user.userId, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async logout(token) {
        const decoded = this.jwtService.decode(token);
        if (decoded && decoded.exp) {
            await this.blacklistRepo.save({
                token,
                expiresAt: new Date(decoded.exp * 1000),
            });
        }
    }
    async isTokenBlacklisted(token) {
        const found = await this.blacklistRepo.findOne({ where: { token } });
        return !!found;
    }
    async getProfile(userId) {
        const userRepo = this.dataSource.getRepository(user_entity_1.User);
        const personRepo = this.dataSource.getRepository(person_entity_1.Person);
        const patientRepo = this.dataSource.getRepository(patient_entity_1.Patient);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const person = await personRepo.findOne({ where: { userId } });
        let patient = null;
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
    async updateProfile(userId, dto) {
        const personRepo = this.dataSource.getRepository(person_entity_1.Person);
        let person = await personRepo.findOne({ where: { userId } });
        if (person) {
            if (dto.firstName)
                person.firstName = dto.firstName;
            if (dto.lastName)
                person.lastName = dto.lastName;
            if (dto.phone)
                person.phone = dto.phone;
            await personRepo.save(person);
        }
        return this.getProfile(userId);
    }
    async changePassword(userId, dto) {
        const userRepo = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (dto.currentPassword && dto.newPassword) {
            const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
            if (!isValid) {
                throw new common_1.BadRequestException('La contraseña actual es incorrecta');
            }
            user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
            await userRepo.save(user);
        }
        return { message: 'Contraseña actualizada exitosamente' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(token_blacklist_entity_1.TokenBlacklist)),
    __param(4, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map