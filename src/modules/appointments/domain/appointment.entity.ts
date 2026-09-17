import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/domain/patient.entity';
import { Professional } from '../../professionals/domain/professional.entity';
import { Resource } from '../../resources/domain/resource.entity';
import { TimeSlot } from '../../agenda/time-slot/domain/time-slot.entity';
import { Treatment } from '../../treatments/domain/treatment.entity';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => Professional)
  @JoinColumn()
  professional: Professional;

  @ManyToOne(() => Resource, { nullable: true })
  @JoinColumn()
  resource?: Resource;

  @ManyToOne(() => TimeSlot)
  @JoinColumn()
  timeSlot: TimeSlot;

  @ManyToOne(() => Treatment, { nullable: true })
  @JoinColumn()
  treatment?: Treatment;

  @Column({ type: 'varchar', default: AppointmentStatus.SCHEDULED })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
