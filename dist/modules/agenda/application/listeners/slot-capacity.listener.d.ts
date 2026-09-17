import { AppointmentsGateway } from '../../../../core/websockets/appointments.gateway';
import { TimeSlotCapacityUpdatedEvent } from '../../domain/events/time-slot-capacity-updated.event';
export declare class SlotCapacityListener {
    private readonly gateway;
    constructor(gateway: AppointmentsGateway);
    handleSlotCapacityUpdated(event: TimeSlotCapacityUpdatedEvent): void;
}
