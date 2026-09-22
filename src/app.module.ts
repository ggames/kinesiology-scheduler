import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ReportsModule } from './modules/reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
       //envFilePath: '.env.${process.env.NODE_ENV}' ,
       isGlobal: true }),
    /*TypeOrmModule.forRootAsync({
      imports: [ ConfigModule],
      useFactory: ( configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_DATABASE'),
        ssl: true,
        
      })
    }), */  
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
    ReportsModule,
  ],
})
export class AppModule {}
