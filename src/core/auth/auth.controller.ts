import { Controller, Post, Get, Patch, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterProfessionalDto } from './dto/register-professional.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login público con email y contraseña para obtener token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Retorna access_token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o cuenta pendiente/inactiva.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register-patient')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro público de paciente: Crea cuenta de usuario y perfil de paciente en una transacción atómica',
  })
  @ApiBody({ type: RegisterPatientDto })
  @ApiResponse({ status: 201, description: 'Usuario y Paciente creados exitosamente.' })
  @ApiResponse({ status: 409, description: 'Email o documento ya registrados.' })
  registerPatient(@Body() dto: RegisterPatientDto) {
    return this.authService.registerPatient(dto);
  }

  /** Alias para soporte de endpoints de registro genéricos */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Alias para registro público de paciente' })
  @ApiBody({ type: RegisterPatientDto })
  register(@Body() dto: RegisterPatientDto) {
    return this.authService.registerPatient(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('register-professional')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro de profesional (Admin): Crea perfil profesional en estado PENDING y envía enlace de activación',
  })
  @ApiBody({ type: RegisterProfessionalDto })
  @ApiResponse({ status: 201, description: 'Profesional creado con estado PENDING.' })
  @ApiResponse({ status: 409, description: 'Email, documento o matrícula ya registrados.' })
  registerProfessional(@Body() dto: RegisterProfessionalDto) {
    return this.authService.registerProfessional(dto);
  }

  @Public()
  @Post('activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activación de cuenta: Establece la contraseña y activa la cuenta',
  })
  @ApiBody({ type: ActivateAccountDto })
  @ApiResponse({ status: 200, description: 'Cuenta activada exitosamente. Retorna JWT.' })
  @ApiResponse({ status: 400, description: 'Token de activación inválido o expirado.' })
  activateAccount(@Body() dto: ActivateAccountDto) {
    return this.authService.activateAccount(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token JWT' })
  @ApiResponse({ status: 200, description: 'Retorna un nuevo access_token.' })
  refresh(@Req() req: any) {
    return this.authService.refresh(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión e invalidar token' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
  logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      this.authService.logout(token);
    }
    return { message: 'Logged out successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  updateProfile(@Req() req: any, @Body() dto: any) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  changePassword(@Req() req: any, @Body() dto: any) {
    return this.authService.changePassword(req.user.userId, dto);
  }
}
