import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In } from 'typeorm';
import { Appointment } from '../appointments/domain/appointment.entity';
import { TimeSlot } from '../agenda/time-slot/domain/time-slot.entity';
import { DailyAgenda } from '../agenda/daily-agenda/domain/daily-agenda.entity';
import { Patient } from '../patients/domain/patient.entity';
import { Professional } from '../professionals/domain/professional.entity';

interface ReportFilters {
  from?: string;
  to?: string;
  professionalId?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepo: Repository<TimeSlot>,
    @InjectRepository(DailyAgenda)
    private readonly dailyAgendaRepo: Repository<DailyAgenda>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Professional)
    private readonly professionalRepo: Repository<Professional>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Reporte de Ausentismo y Abandono
   */
  async getAbsenteeismReport(filters: ReportFilters) {
    // Build query for appointments with relations
    const qb = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.person', 'patientPerson')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('professional.person', 'professionalPerson')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
      .leftJoinAndSelect('timeSlot.agenda', 'agenda');

    if (filters.professionalId) {
      qb.andWhere('professional.id = :profId', { profId: filters.professionalId });
    }

    if (filters.from) {
      qb.andWhere('appointment.createdAt >= :from', { from: new Date(filters.from) });
    }

    if (filters.to) {
      qb.andWhere('appointment.createdAt <= :to', { to: new Date(filters.to + 'T23:59:59') });
    }

    const appointments = await qb.orderBy('appointment.createdAt', 'ASC').getMany();

    const totalAppointments = appointments.length;
    // Regla de negocio: todo turno que NO sea CANCELLED, NO_SHOW ni ABSENT cuenta como asistido/completado
    const ESTADOS_AUSENCIA = new Set(['CANCELLED', 'NO_SHOW', 'ABSENT']);
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
    const noShowAppointments    = appointments.filter(a => a.status === 'NO_SHOW').length;
    const absentAppointments    = appointments.filter(a => a.status === 'ABSENT').length;
    // Completados = todos los que no son CANCELLED, NO_SHOW ni ABSENT
    const completedAppointments = appointments.filter(a => !ESTADOS_AUSENCIA.has(a.status)).length;

    const effectiveTotal = totalAppointments;
    const attendanceRate = effectiveTotal > 0
      ? Math.round((completedAppointments / effectiveTotal) * 10000) / 100
      : 0;
    const absenteeismRate = effectiveTotal > 0
      ? Math.round(((noShowAppointments + absentAppointments) / effectiveTotal) * 10000) / 100
      : 0;

    // Monthly breakdown
    const monthlyMap = new Map<string, {
      total: number; completed: number; cancelled: number; noShow: number; absent: number;
    }>();

    for (const app of appointments) {
      const date = app.createdAt instanceof Date ? app.createdAt : new Date(app.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { total: 0, completed: 0, cancelled: 0, noShow: 0, absent: 0 });
      }
      const entry = monthlyMap.get(monthKey)!;
      entry.total++;
      // Regla: no-cancelled + no-ausente = completado
      if (app.status === 'CANCELLED')   entry.cancelled++;
      else if (app.status === 'NO_SHOW') entry.noShow++;
      else if (app.status === 'ABSENT')  entry.absent++;
      else                               entry.completed++;
    }

    const monthlyBreakdown = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        return {
          month,
          ...data,
          // Tasa de asistencia sobre el total (no excluir cancelados de la base)
          attendanceRate: data.total > 0 ? Math.round((data.completed / data.total) * 10000) / 100 : 0,
        };
      });

    // Top absent patients
    const patientAbsMap = new Map<string, {
      patientId: string; patientName: string; totalAppointments: number; missedAppointments: number;
    }>();

    for (const app of appointments) {
      if (!app.patient?.id) continue;
      const pid = app.patient.id;
      if (!patientAbsMap.has(pid)) {
        const name = app.patient.person
          ? `${app.patient.person.firstName || ''} ${app.patient.person.lastName || ''}`.trim()
          : pid;
        patientAbsMap.set(pid, { patientId: pid, patientName: name, totalAppointments: 0, missedAppointments: 0 });
      }
      const entry = patientAbsMap.get(pid)!;
      entry.totalAppointments++;
      if (app.status === 'NO_SHOW' || app.status === 'ABSENT') {
        entry.missedAppointments++;
      }
    }

    const topAbsentPatients = Array.from(patientAbsMap.values())
      .filter(p => p.missedAppointments > 0)
      .map(p => ({
        ...p,
        absenteeismRate: p.totalAppointments > 0
          ? Math.round((p.missedAppointments / p.totalAppointments) * 10000) / 100
          : 0,
      }))
      .sort((a, b) => b.missedAppointments - a.missedAppointments)
      .slice(0, 10);

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      absentAppointments,
      attendanceRate,
      absenteeismRate,
      monthlyBreakdown,
      topAbsentPatients,
    };
  }

  /**
   * Reporte de Ocupación de Agenda
   */
  async getScheduleOccupancyReport(filters: ReportFilters) {
    const qb = this.timeSlotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.agenda', 'agenda')
      .leftJoinAndSelect('agenda.professional', 'professional');

    if (filters.professionalId) {
      qb.andWhere('agenda.professionalId = :profId', { profId: filters.professionalId });
    }

    if (filters.from) {
      qb.andWhere('agenda.date >= :from', { from: filters.from });
    }

    if (filters.to) {
      qb.andWhere('agenda.date <= :to', { to: filters.to });
    }

    const slots = await qb.orderBy('agenda.date', 'ASC').getMany();

    const totalSlots = slots.length;
    const bookedSlots = slots.filter(s => s.status === 'BOOKED' || s.currentBookings > 0).length;
    const availableSlots = slots.filter(s => s.status === 'AVAILABLE' && s.currentBookings === 0).length;
    const blockedSlots = slots.filter(s => s.status === 'BLOCKED').length;
    const occupancyRate = totalSlots > 0
      ? Math.round((bookedSlots / totalSlots) * 10000) / 100
      : 0;

    // Monthly breakdown
    const monthlyMap = new Map<string, {
      totalSlots: number; bookedSlots: number; availableSlots: number;
    }>();

    // Daily breakdown
    const dailyMap = new Map<string, {
      totalSlots: number; bookedSlots: number;
    }>();

    for (const slot of slots) {
      if (!slot.agenda?.date) continue;
      const rawDate: any = slot.agenda.date;
      const datePart = typeof rawDate === 'string'
        ? rawDate.substring(0, 10)
        : rawDate instanceof Date
        ? rawDate.toISOString().split('T')[0]
        : '';

      if (!datePart) continue;

      const monthKey = datePart.substring(0, 7);
      const isBooked = slot.status === 'BOOKED' || slot.currentBookings > 0;
      const isAvailable = slot.status === 'AVAILABLE' && slot.currentBookings === 0;

      // Monthly
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { totalSlots: 0, bookedSlots: 0, availableSlots: 0 });
      }
      const monthly = monthlyMap.get(monthKey)!;
      monthly.totalSlots++;
      if (isBooked) monthly.bookedSlots++;
      if (isAvailable) monthly.availableSlots++;

      // Daily
      if (!dailyMap.has(datePart)) {
        dailyMap.set(datePart, { totalSlots: 0, bookedSlots: 0 });
      }
      const daily = dailyMap.get(datePart)!;
      daily.totalSlots++;
      if (isBooked) daily.bookedSlots++;
    }

    const monthlyBreakdown = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data,
        occupancyRate: data.totalSlots > 0
          ? Math.round((data.bookedSlots / data.totalSlots) * 10000) / 100
          : 0,
      }));

    const dailyBreakdown = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        ...data,
        occupancyRate: data.totalSlots > 0
          ? Math.round((data.bookedSlots / data.totalSlots) * 10000) / 100
          : 0,
      }));

    return {
      totalSlots,
      bookedSlots,
      availableSlots,
      blockedSlots,
      occupancyRate,
      monthlyBreakdown,
      dailyBreakdown,
    };
  }

  /**
   * Reporte Consolidado
   */
  async getConsolidatedReport(filters: ReportFilters) {
    const [absenteeism, occupancy] = await Promise.all([
      this.getAbsenteeismReport(filters),
      this.getScheduleOccupancyReport(filters),
    ]);

    const totalPatients = await this.patientRepo.count();
    const totalProfessionals = await this.professionalRepo.count();

    const averageSessionsPerPatient = totalPatients > 0
      ? Math.round((absenteeism.completedAppointments / totalPatients) * 100) / 100
      : 0;

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return {
      period: {
        from: filters.from || sixMonthsAgo.toISOString().split('T')[0],
        to: filters.to || now.toISOString().split('T')[0],
      },
      totalPatients,
      totalProfessionals,
      totalAppointments: absenteeism.totalAppointments,
      attendanceRate: absenteeism.attendanceRate,
      occupancyRate: occupancy.occupancyRate,
      absenteeismRate: absenteeism.absenteeismRate,
      averageSessionsPerPatient,
    };
  }
}
