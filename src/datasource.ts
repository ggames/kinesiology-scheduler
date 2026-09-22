import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Entidades del dominio
import { User } from './modules/users/domain/user.entity';
import { TokenBlacklist } from './modules/users/domain/token-blacklist.entity';
import { Person } from './modules/persons/domain/person.entity';
import { Patient } from './modules/patients/domain/patient.entity';
import { Professional } from './modules/professionals/domain/professional.entity';
import { Appointment } from './modules/appointments/domain/appointment.entity';
import { DailyAgenda } from './modules/agenda/daily-agenda/domain/daily-agenda.entity';
import { TimeSlot } from './modules/agenda/time-slot/domain/time-slot.entity';
import { WeeklySchedule } from './modules/agenda/weekly-schedule/domain/weekly-schedule.entity';
import { DoctorScheduleTemplate } from './modules/agenda/doctor-schedule-template/domain/doctor-schedule-template.entity';
import { Clinic } from './modules/agenda/clinic/domain/clinic.entity';
import { Holiday } from './modules/agenda/holiday/domain/holiday.entity';
import { HealthInsurance } from './modules/health-insurances/domain/health-insurance.entity';
import { MedicalHistory } from './modules/medical-histories/domain/medical-history.entity';
import { Resource } from './modules/resources/domain/resource.entity';
import { Treatment } from './modules/treatments/domain/treatment.entity';

dotenv.config();

const dbType = process.env.DB_TYPE || 'postgres';
const isPostgres = dbType === 'postgres';
const isSslDisabled = process.env.DB_SSL === 'false';
const sslOptions = isPostgres && !isSslDisabled ? { rejectUnauthorized: false } : false;

let host = process.env.DB_HOST || 'localhost';
if (host.includes('-pooler.')) {
  host = host.replace('-pooler.', '.');
}

const user = process.env.DB_USER || '';
const pass = process.env.DB_PASS || '';
const port = process.env.DB_PORT || '5432';
const dbName = process.env.DB_DATABASE || 'neondb';
let optionsStr = process.env.DB_OPTIONS || '';
let url = process.env.DB_URL;
if (url && url.includes('-pooler.')) {
  url = url.replace('-pooler.', '.');
}

if (isPostgres && !url && host !== '127.0.0.1' && host !== 'localhost') {
  if (!optionsStr) {
    optionsStr = 'sslmode=require';
  }
  const cleanOptions = optionsStr.startsWith('?') ? optionsStr.slice(1) : optionsStr;
  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(pass);
  url = `postgres://${encodedUser}:${encodedPass}@${host}:${port}/${dbName}?${cleanOptions}`;
}

const dsOptions: any = {
  type: dbType as any,
  ssl: sslOptions,
  extra: isPostgres && !isSslDisabled
    ? {
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 30000,
        keepAlive: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {},
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [
    User,
    TokenBlacklist,
    Person,
    Patient,
    Professional,
    Appointment,
    DailyAgenda,
    TimeSlot,
    WeeklySchedule,
    DoctorScheduleTemplate,
    Clinic,
    Holiday,
    HealthInsurance,
    MedicalHistory,
    Resource,
    Treatment,
    join(__dirname, '**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  subscribers: [],
};

if (isPostgres && url) {
  dsOptions.url = url;
} else if (isPostgres) {
  dsOptions.host = host;
  dsOptions.port = parseInt(port, 10);
  dsOptions.username = user;
  dsOptions.password = pass;
  dsOptions.database = dbName;
} else {
  dsOptions.database = 'kinesiology.sqlite';
}

/**
 * Configuración de DataSource para TypeORM CLI, migraciones y ejecución del sistema (soporta Neon PostgreSQL).
 */
export const AppDataSource = new DataSource(dsOptions);
