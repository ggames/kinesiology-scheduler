import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import type { Person } from '../../persons/domain/person.entity';

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  passwordHash: string;

  @Column({ default: 'PATIENT' })
  role: string;

  @Column('simple-array', { nullable: true })
  roles?: string[];

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  activationToken?: string;

  @Column({ nullable: true })
  activationTokenExpiresAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  fotoPerfilUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  otpCode?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt?: Date | null;

  @OneToOne('Person', (person: any) => person.user)
  person?: Person;

  @CreateDateColumn()
  createdAt: Date;
}
