import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../domain/appointment.entity';
import { TimeSlot, TimeSlotStatus } from '../../../agenda/time-slot/domain/time-slot.entity';

@Injectable()
export class AppointmentExpirationTask {
  private readonly logger = new Logger(AppointmentExpirationTask.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Cron('*/5 * * * *')
  async handleExpiration() {
    const now = new Date();
    const repo = this.dataSource.getRepository(Appointment);
    const slotRepo = this.dataSource.getRepository(TimeSlot);

    try {
      const scheduledAppointments = await repo.find({
        where: { status: AppointmentStatus.SCHEDULED },
        relations: { timeSlot: { agenda: true } },
      });

      let finalizados = 0;
      for (const appt of scheduledAppointments) {
        const slot = appt.timeSlot;
        if (!slot?.agenda?.date) continue;

        const rawDate: any = slot.agenda.date;
        const datePart =
          typeof rawDate === 'string'
            ? rawDate.substring(0, 10)
            : rawDate instanceof Date
            ? rawDate.toISOString().split('T')[0]
            : null;

        if (!datePart) continue;

        const endTimePart = slot.endTime.length === 5 ? slot.endTime + ':00' : slot.endTime;
        const slotEnd = new Date(`${datePart}T${endTimePart}`);

        if (slotEnd.getTime() < now.getTime()) {
          appt.status = AppointmentStatus.COMPLETED;
          await repo.save(appt);

          if (slot.status !== TimeSlotStatus.EXPIRED) {
            slot.status = TimeSlotStatus.EXPIRED;
            await slotRepo.save(slot);
          }

          finalizados++;
        }
      }

      if (finalizados > 0) {
        this.logger.log(`Auto-finalizados ${finalizados} turnos vencidos.`);
      }
    } catch (err) {
      this.logger.error('Error procesando auto-finalización de turnos', err);
    }
  }
}
