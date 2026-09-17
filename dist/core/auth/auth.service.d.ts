import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterProfessionalDto } from './dto/register-professional.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { Repository, DataSource } from 'typeorm';
import { TokenBlacklist } from '../../modules/users/domain/token-blacklist.entity';
import { UserStatus } from '../../modules/users/domain/user.entity';
import { Person } from '../../modules/persons/domain/person.entity';
import { Patient } from '../../modules/patients/domain/patient.entity';
import { Professional } from '../../modules/professionals/domain/professional.entity';
export declare class AuthService implements OnModuleInit {
    private usersService;
    private jwtService;
    private configService;
    private blacklistRepo;
    private dataSource;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, blacklistRepo: Repository<TokenBlacklist>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    validateUser(email: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            roles: any;
            status: any;
        };
    }>;
    registerPatient(dto: RegisterPatientDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            roles: string[] | undefined;
            status: UserStatus;
        };
        person: Person;
        patient: Patient;
    }>;
    registerProfessional(dto: RegisterProfessionalDto): Promise<{
        message: string;
        activationToken: string;
        activationLink: string;
        user: {
            id: string;
            email: string;
            role: string;
            roles: string[] | undefined;
            status: UserStatus;
            activationTokenExpiresAt: Date | undefined;
        };
        person: Person;
        professional: Professional;
    }>;
    activateAccount(dto: ActivateAccountDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            roles: string[];
            status: UserStatus;
        };
    }>;
    refresh(user: {
        email: string;
        userId: string;
        role: string;
    }): Promise<{
        access_token: string;
    }>;
    logout(token: string): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        documentId: string;
        phone: string;
        obraSocial: string;
        nroAfiliado: string;
        role: string;
        roles: string[];
    }>;
    updateProfile(userId: string, dto: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        documentId: string;
        phone: string;
        obraSocial: string;
        nroAfiliado: string;
        role: string;
        roles: string[];
    }>;
    changePassword(userId: string, dto: {
        currentPassword?: string;
        newPassword?: string;
    }): Promise<{
        message: string;
    }>;
}
