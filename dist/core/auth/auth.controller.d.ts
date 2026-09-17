import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterProfessionalDto } from './dto/register-professional.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
            status: import("../../modules/users/domain/user.entity").UserStatus;
        };
        person: import("../../modules/persons/domain/person.entity").Person;
        patient: import("../../modules/patients/domain/patient.entity").Patient;
    }>;
    register(dto: RegisterPatientDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            roles: string[] | undefined;
            status: import("../../modules/users/domain/user.entity").UserStatus;
        };
        person: import("../../modules/persons/domain/person.entity").Person;
        patient: import("../../modules/patients/domain/patient.entity").Patient;
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
            status: import("../../modules/users/domain/user.entity").UserStatus;
            activationTokenExpiresAt: Date | undefined;
        };
        person: import("../../modules/persons/domain/person.entity").Person;
        professional: import("../../modules/professionals/domain/professional.entity").Professional;
    }>;
    activateAccount(dto: ActivateAccountDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            roles: string[];
            status: import("../../modules/users/domain/user.entity").UserStatus;
        };
    }>;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
    logout(req: any): {
        message: string;
    };
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, dto: any): Promise<{
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
    changePassword(req: any, dto: any): Promise<{
        message: string;
    }>;
}
