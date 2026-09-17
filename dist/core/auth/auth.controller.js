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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_patient_dto_1 = require("./dto/register-patient.dto");
const register_professional_dto_1 = require("./dto/register-professional.dto");
const activate_account_dto_1 = require("./dto/activate-account.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const public_decorator_1 = require("./decorators/public.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    registerPatient(dto) {
        return this.authService.registerPatient(dto);
    }
    register(dto) {
        return this.authService.registerPatient(dto);
    }
    registerProfessional(dto) {
        return this.authService.registerProfessional(dto);
    }
    activateAccount(dto) {
        return this.authService.activateAccount(dto);
    }
    refresh(req) {
        return this.authService.refresh(req.user);
    }
    logout(req) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            this.authService.logout(token);
        }
        return { message: 'Logged out successfully.' };
    }
    getProfile(req) {
        return this.authService.getProfile(req.user.userId);
    }
    updateProfile(req, dto) {
        return this.authService.updateProfile(req.user.userId, dto);
    }
    changePassword(req, dto) {
        return this.authService.changePassword(req.user.userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login público con email y contraseña para obtener token JWT' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna access_token JWT.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas o cuenta pendiente/inactiva.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register-patient'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro público de paciente: Crea cuenta de usuario y perfil de paciente en una transacción atómica',
    }),
    (0, swagger_1.ApiBody)({ type: register_patient_dto_1.RegisterPatientDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario y Paciente creados exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email o documento ya registrados.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_patient_dto_1.RegisterPatientDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerPatient", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Alias para registro público de paciente' }),
    (0, swagger_1.ApiBody)({ type: register_patient_dto_1.RegisterPatientDto }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_patient_dto_1.RegisterPatientDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('register-professional'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro de profesional (Admin): Crea perfil profesional en estado PENDING y envía enlace de activación',
    }),
    (0, swagger_1.ApiBody)({ type: register_professional_dto_1.RegisterProfessionalDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profesional creado con estado PENDING.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email, documento o matrícula ya registrados.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_professional_dto_1.RegisterProfessionalDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerProfessional", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('activate-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Activación de cuenta: Establece la contraseña y activa la cuenta',
    }),
    (0, swagger_1.ApiBody)({ type: activate_account_dto_1.ActivateAccountDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cuenta activada exitosamente. Retorna JWT.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token de activación inválido o expirado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activate_account_dto_1.ActivateAccountDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "activateAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refrescar token JWT' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna un nuevo access_token.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar sesión e invalidar token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión cerrada exitosamente.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil del usuario autenticado' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar perfil del usuario autenticado' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar contraseña del usuario autenticado' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map