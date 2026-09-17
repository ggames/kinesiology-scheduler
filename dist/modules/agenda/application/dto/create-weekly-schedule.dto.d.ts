export declare class CreateWeeklyScheduleDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes?: number;
    maxCapacityPerSlot?: number;
}
declare const UpdateWeeklyScheduleDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreateWeeklyScheduleDto>>;
export declare class UpdateWeeklyScheduleDto extends UpdateWeeklyScheduleDto_base {
}
export {};
