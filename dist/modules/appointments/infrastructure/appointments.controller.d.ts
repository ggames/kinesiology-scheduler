import { AppointmentsService } from '../application/appointments.service';
import { CreateAppointmentDto } from '../application/dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findMyAppointments(req: any): Promise<any[]>;
    create(createAppointmentDto: CreateAppointmentDto, req: any): Promise<import("../domain/appointment.entity").Appointment>;
    findAll(): Promise<any[]>;
    cancel(id: string): Promise<any>;
}
