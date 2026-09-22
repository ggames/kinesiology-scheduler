import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './infrastructure/appointments.controller';
import { AppointmentsService } from './application/appointments.service';
import { Appointment } from './domain/appointment.entity';
import { TimeSlot } from '../agenda/time-slot/domain/time-slot.entity';
import { Holiday } from '../agenda/holiday/domain/holiday.entity';
import { AppointmentsGateway } from '../../core/websockets/appointments.gateway';
import { SlotCapacityListener } from '../agenda/application/listeners/slot-capacity.listener';
import { AppointmentExpirationTask } from './application/tasks/appointment-expiration.task';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, TimeSlot, Holiday])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsGateway, SlotCapacityListener, AppointmentExpirationTask],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

