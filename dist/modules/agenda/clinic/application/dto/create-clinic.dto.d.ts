export declare class CreateClinicDto {
    id?: string;
    name: string;
}
declare const UpdateClinicDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreateClinicDto>>;
export declare class UpdateClinicDto extends UpdateClinicDto_base {
}
export {};
