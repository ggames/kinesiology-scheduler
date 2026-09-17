"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotCapacityListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const appointments_gateway_1 = require("../../../../core/websockets/appointments.gateway");
const time_slot_capacity_updated_event_1 = require("../../domain/events/time-slot-capacity-updated.event");
let SlotCapacityListener = class SlotCapacityListener {
    gateway;
    constructor(gateway) {
        this.gateway = gateway;
    }
    handleSlotCapacityUpdated(event) {
        this.gateway.emitCapacityUpdate({
            slotId: event.slotId,
            remainingCapacity: event.remainingCapacity,
            status: event.status,
        });
    }
};
exports.SlotCapacityListener = SlotCapacityListener;
__decorate([
    (0, event_emitter_1.OnEvent)('slot.capacity.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_slot_capacity_updated_event_1.TimeSlotCapacityUpdatedEvent]),
    __metadata("design:returntype", void 0)
], SlotCapacityListener.prototype, "handleSlotCapacityUpdated", null);
exports.SlotCapacityListener = SlotCapacityListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_gateway_1.AppointmentsGateway])
], SlotCapacityListener);
//# sourceMappingURL=slot-capacity.listener.js.map