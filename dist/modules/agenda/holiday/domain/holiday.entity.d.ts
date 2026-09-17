import type { Clinic } from '../../clinic/domain/clinic.entity';
export declare enum HolidayType {
    TOTAL = "TOTAL",
    PARTIAL = "PARTIAL"
}
export declare class Holiday {
    id: string;
    date: string;
    type: HolidayType;
    partialStartTime?: string;
    partialEndTime?: string;
    clinic: Clinic;
}
