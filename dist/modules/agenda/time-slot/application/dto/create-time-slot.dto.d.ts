export declare class CreateTimeSlotDto {
    agendaId?: string;
    weeklyScheduleId?: string;
    startTime: string;
    endTime: string;
    maxCapacity?: number;
}
declare const UpdateTimeSlotDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreateTimeSlotDto>>;
export declare class UpdateTimeSlotDto extends UpdateTimeSlotDto_base {
}
export {};
