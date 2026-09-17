"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const clinic_entity_1 = require("./clinic/domain/clinic.entity");
const holiday_entity_1 = require("./holiday/domain/holiday.entity");
const daily_agenda_entity_1 = require("./daily-agenda/domain/daily-agenda.entity");
const time_slot_entity_1 = require("./time-slot/domain/time-slot.entity");
const weekly_schedule_entity_1 = require("./weekly-schedule/domain/weekly-schedule.entity");
const doctor_schedule_template_entity_1 = require("./doctor-schedule-template/domain/doctor-schedule-template.entity");
const agenda_service_1 = require("./application/agenda.service");
const clinic_service_1 = require("./clinic/application/services/clinic.service");
const holiday_service_1 = require("./holiday/application/services/holiday.service");
const daily_agenda_service_1 = require("./daily-agenda/application/services/daily-agenda.service");
const time_slot_service_1 = require("./time-slot/application/services/time-slot.service");
const weekly_schedule_service_1 = require("./weekly-schedule/application/services/weekly-schedule.service");
const calendar_generator_service_1 = require("./application/services/calendar-generator.service");
const agenda_controller_1 = require("./infrastructure/agenda.controller");
const clinic_controller_1 = require("./clinic/infrastructure/clinic.controller");
const holiday_controller_1 = require("./holiday/infrastructure/holiday.controller");
const daily_agenda_controller_1 = require("./daily-agenda/infrastructure/daily-agenda.controller");
const time_slot_controller_1 = require("./time-slot/infrastructure/time-slot.controller");
const weekly_schedule_controller_1 = require("./weekly-schedule/infrastructure/weekly-schedule.controller");
const patients_module_1 = require("../patients/patients.module");
const professionals_module_1 = require("../professionals/professionals.module");
let AgendaModule = class AgendaModule {
};
exports.AgendaModule = AgendaModule;
exports.AgendaModule = AgendaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                clinic_entity_1.Clinic,
                holiday_entity_1.Holiday,
                daily_agenda_entity_1.DailyAgenda,
                time_slot_entity_1.TimeSlot,
                weekly_schedule_entity_1.WeeklySchedule,
                doctor_schedule_template_entity_1.DoctorScheduleTemplate,
            ]),
            patients_module_1.PatientsModule,
            professionals_module_1.ProfessionalsModule,
        ],
        controllers: [
            agenda_controller_1.AgendaController,
            clinic_controller_1.ClinicController,
            holiday_controller_1.HolidayController,
            daily_agenda_controller_1.DailyAgendaController,
            time_slot_controller_1.TimeSlotController,
            weekly_schedule_controller_1.WeeklyScheduleController,
        ],
        providers: [
            agenda_service_1.AgendaService,
            clinic_service_1.ClinicService,
            holiday_service_1.HolidayService,
            daily_agenda_service_1.DailyAgendaService,
            time_slot_service_1.TimeSlotService,
            weekly_schedule_service_1.WeeklyScheduleService,
            calendar_generator_service_1.CalendarGeneratorService,
        ],
        exports: [typeorm_1.TypeOrmModule, agenda_service_1.AgendaService, calendar_generator_service_1.CalendarGeneratorService],
    })
], AgendaModule);
//# sourceMappingURL=agenda.module.js.map