import { HolidayType } from '../../domain/holiday.entity';
export declare class CreateHolidayDto {
    id?: string;
    date: string;
    type: HolidayType;
    partialStartTime?: string;
    partialEndTime?: string;
    clinicId?: string;
}
declare const UpdateHolidayDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreateHolidayDto>>;
export declare class UpdateHolidayDto extends UpdateHolidayDto_base {
}
export {};
