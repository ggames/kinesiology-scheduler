"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const database_module_1 = require("./core/database/database.module");
const auth_module_1 = require("./core/auth/auth.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const patients_module_1 = require("./modules/patients/patients.module");
const professionals_module_1 = require("./modules/professionals/professionals.module");
const health_insurances_module_1 = require("./modules/health-insurances/health-insurances.module");
const resources_module_1 = require("./modules/resources/resources.module");
const agenda_module_1 = require("./modules/agenda/agenda.module");
const health_module_1 = require("./health/health.module");
const treatments_module_1 = require("./modules/treatments/treatments.module");
const medical_histories_module_1 = require("./modules/medical-histories/medical-histories.module");
const persons_module_1 = require("./modules/persons/persons.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            appointments_module_1.AppointmentsModule,
            patients_module_1.PatientsModule,
            professionals_module_1.ProfessionalsModule,
            health_insurances_module_1.HealthInsurancesModule,
            resources_module_1.ResourcesModule,
            health_module_1.HealthModule,
            agenda_module_1.AgendaModule,
            treatments_module_1.TreatmentsModule,
            medical_histories_module_1.MedicalHistoriesModule,
            persons_module_1.PersonsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map