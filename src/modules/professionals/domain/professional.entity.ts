import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Person } from '../../persons/domain/person.entity';

/**
 * Professional entity representing the practitioner/clinical profile of a Person.
 */
@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Person relation (groups all shared identity & contact attributes)
  @OneToOne(() => Person, (person) => person.professional, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column()
  personId: string;

  @Column()
  specialty: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  licenseNumber?: string; // Matrícula profesional

  @CreateDateColumn()
  createdAt: Date;
}
