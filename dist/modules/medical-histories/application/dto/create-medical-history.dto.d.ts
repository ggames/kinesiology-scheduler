export declare class CreateMedicalHistoryDto {
    patientId: string;
    medicalRecordNumber?: string;
    diagnosis?: string;
    referringDoctor?: string;
    medicalReferralDocument?: string;
    medicalHistory?: string;
}
declare const UpdateMedicalHistoryDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreateMedicalHistoryDto>>;
export declare class UpdateMedicalHistoryDto extends UpdateMedicalHistoryDto_base {
}
export {};
