import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Patient } from '../../patients/domain/patient.entity';

@Entity('medical_histories')
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  medicalRecordNumber?: string; // Número de historia clínica

  @Column({ type: 'text', nullable: true })
  diagnosis?: string; // Diagnóstico principal / motivo de consulta

  @Column({ type: 'varchar', length: 200, nullable: true })
  referringDoctor?: string; // Médico derivante

  @Column({ type: 'varchar', length: 255, nullable: true })
  medicalReferralDocument?: string; // Documento / Orden médica de derivación

  @Column({ type: 'text', nullable: true })
  medicalHistory?: string; // Anamnesis / Antecedentes médicos detallados

  @OneToOne('Patient', (patient: any) => patient.medicalHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ nullable: true })
  patientId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
