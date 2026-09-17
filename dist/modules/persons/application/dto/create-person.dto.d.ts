import { Gender } from '../../domain/person.entity';
export declare class CreatePersonDto {
    firstName: string;
    lastName: string;
    documentId: string;
    birthDate?: string;
    gender?: Gender;
    phone?: string;
    email?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}
declare const UpdatePersonDto_base: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Type<Partial<CreatePersonDto>>;
export declare class UpdatePersonDto extends UpdatePersonDto_base {
}
export {};
