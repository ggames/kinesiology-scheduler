import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './core/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { HealthInsurancesModule } from './modules/health-insurances/health-insurances.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { HealthModule } from './health/health.module';
import { TreatmentsModule } from './modules/treatments/treatments.module';
import { MedicalHistoriesModule } from './modules/medical-histories/medical-histories.module';
import { PersonsModule } from './modules/persons/persons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    AppointmentsModule,
    PatientsModule,
    ProfessionalsModule,
    HealthInsurancesModule,
    ResourcesModule,
    HealthModule,
    AgendaModule,
    TreatmentsModule,
    MedicalHistoriesModule,
    PersonsModule,
  ],
})
export class AppModule {}
