import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/domain/patient.entity';
import { Professional } from '../../professionals/domain/professional.entity';

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => Professional)
  @JoinColumn()
  prescribingProfessional: Professional;

  @Column()
  description: string;

  @Column({ type: 'int' })
  totalSessions: number;
}
