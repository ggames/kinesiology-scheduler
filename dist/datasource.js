"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const user_entity_1 = require("./modules/users/domain/user.entity");
const token_blacklist_entity_1 = require("./modules/users/domain/token-blacklist.entity");
const person_entity_1 = require("./modules/persons/domain/person.entity");
const patient_entity_1 = require("./modules/patients/domain/patient.entity");
const professional_entity_1 = require("./modules/professionals/domain/professional.entity");
const appointment_entity_1 = require("./modules/appointments/domain/appointment.entity");
const daily_agenda_entity_1 = require("./modules/agenda/daily-agenda/domain/daily-agenda.entity");
const time_slot_entity_1 = require("./modules/agenda/time-slot/domain/time-slot.entity");
const weekly_schedule_entity_1 = require("./modules/agenda/weekly-schedule/domain/weekly-schedule.entity");
const doctor_schedule_template_entity_1 = require("./modules/agenda/doctor-schedule-template/domain/doctor-schedule-template.entity");
const clinic_entity_1 = require("./modules/agenda/clinic/domain/clinic.entity");
const holiday_entity_1 = require("./modules/agenda/holiday/domain/holiday.entity");
const health_insurance_entity_1 = require("./modules/health-insurances/domain/health-insurance.entity");
const medical_history_entity_1 = require("./modules/medical-histories/domain/medical-history.entity");
const resource_entity_1 = require("./modules/resources/domain/resource.entity");
const treatment_entity_1 = require("./modules/treatments/domain/treatment.entity");
dotenv.config();
const dbType = process.env.DB_TYPE || 'postgres';
const isPostgres = dbType === 'postgres';
const isSslDisabled = process.env.DB_SSL === 'false';
const sslOptions = isPostgres && !isSslDisabled ? { rejectUnauthorized: false } : false;
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || '';
const pass = process.env.DB_PASS || '';
const port = process.env.DB_PORT || '5432';
const dbName = process.env.DB_DATABASE || 'neondb';
let optionsStr = process.env.DB_OPTIONS || '';
let url = process.env.DB_URL;
if (isPostgres && !url && host !== '127.0.0.1' && host !== 'localhost') {
    if (!optionsStr) {
        optionsStr = 'sslmode=require';
    }
    const cleanOptions = optionsStr.startsWith('?') ? optionsStr.slice(1) : optionsStr;
    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(pass);
    url = `postgres://${encodedUser}:${encodedPass}@${host}:${port}/${dbName}?${cleanOptions}`;
}
const dsOptions = {
    type: dbType,
    ssl: sslOptions,
    extra: isPostgres && !isSslDisabled
        ? {
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {},
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    entities: [
        user_entity_1.User,
        token_blacklist_entity_1.TokenBlacklist,
        person_entity_1.Person,
        patient_entity_1.Patient,
        professional_entity_1.Professional,
        appointment_entity_1.Appointment,
        daily_agenda_entity_1.DailyAgenda,
        time_slot_entity_1.TimeSlot,
        weekly_schedule_entity_1.WeeklySchedule,
        doctor_schedule_template_entity_1.DoctorScheduleTemplate,
        clinic_entity_1.Clinic,
        holiday_entity_1.Holiday,
        health_insurance_entity_1.HealthInsurance,
        medical_history_entity_1.MedicalHistory,
        resource_entity_1.Resource,
        treatment_entity_1.Treatment,
        (0, path_1.join)(__dirname, '**/*.entity{.ts,.js}'),
    ],
    migrations: [(0, path_1.join)(__dirname, 'migrations/*{.ts,.js}')],
    subscribers: [],
};
if (isPostgres && url) {
    dsOptions.url = url;
}
else if (isPostgres) {
    dsOptions.host = host;
    dsOptions.port = parseInt(port, 10);
    dsOptions.username = user;
    dsOptions.password = pass;
    dsOptions.database = dbName;
}
else {
    dsOptions.database = 'kinesiology.sqlite';
}
exports.AppDataSource = new typeorm_1.DataSource(dsOptions);
//# sourceMappingURL=datasource.js.map