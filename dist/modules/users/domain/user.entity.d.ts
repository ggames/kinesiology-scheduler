import type { Person } from '../../persons/domain/person.entity';
export declare enum UserStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
    roles?: string[];
    status: UserStatus;
    activationToken?: string;
    activationTokenExpiresAt?: Date;
    person?: Person;
    createdAt: Date;
}
