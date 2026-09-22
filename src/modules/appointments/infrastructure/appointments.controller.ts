import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from '../application/appointments.service';
import { CreateAppointmentDto } from '../application/dto/create-appointment.dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('my-appointments')
  @ApiOperation({ summary: 'Get appointments for the logged-in patient' })
  findMyAppointments(@Req() req: any) {
    const userId = req.user?.userId;
    return this.appointmentsService.findMyAppointments(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: any) {
    const userRole = req.user?.role || 'PATIENT';
    const userId = req.user?.userId;
    return this.appointmentsService.create(createAppointmentDto, userRole, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status (e.g. NO_SHOW, COMPLETED, SCHEDULED)' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.appointmentsService.updateStatus(id, body.status);
  }
}
