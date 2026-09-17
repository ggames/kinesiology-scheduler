import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Appointment } from '../domain/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private readonly appointmentRepository;
    private readonly dataSource;
    private readonly eventEmitter;
    constructor(appointmentRepository: Repository<Appointment>, dataSource: DataSource, eventEmitter: EventEmitter2);
    create(createDto: CreateAppointmentDto, userRole?: string, userId?: string): Promise<Appointment>;
    findAll(): Promise<any[]>;
    cancel(id: string): Promise<any>;
    findMyAppointments(userId: string): Promise<any[]>;
}
