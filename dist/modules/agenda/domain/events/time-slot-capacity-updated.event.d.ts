export declare class TimeSlotCapacityUpdatedEvent {
    readonly slotId: string;
    readonly remainingCapacity: number;
    readonly status: string;
    constructor(slotId: string, remainingCapacity: number, status: string);
}
