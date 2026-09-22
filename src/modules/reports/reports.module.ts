import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Appointment } from '../appointments/domain/appointment.entity';
import { TimeSlot } from '../agenda/time-slot/domain/time-slot.entity';
import { DailyAgenda } from '../agenda/daily-agenda/domain/daily-agenda.entity';
import { Patient } from '../patients/domain/patient.entity';
import { Professional } from '../professionals/domain/professional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      TimeSlot,
      DailyAgenda,
      Patient,
      Professional,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
