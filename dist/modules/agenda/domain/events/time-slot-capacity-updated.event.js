"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotCapacityUpdatedEvent = void 0;
class TimeSlotCapacityUpdatedEvent {
    slotId;
    remainingCapacity;
    status;
    constructor(slotId, remainingCapacity, status) {
        this.slotId = slotId;
        this.remainingCapacity = remainingCapacity;
        this.status = status;
    }
}
exports.TimeSlotCapacityUpdatedEvent = TimeSlotCapacityUpdatedEvent;
//# sourceMappingURL=time-slot-capacity-updated.event.js.map