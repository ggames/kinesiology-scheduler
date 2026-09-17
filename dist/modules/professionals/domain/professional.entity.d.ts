import { Person } from '../../persons/domain/person.entity';
export declare class Professional {
    id: string;
    person: Person;
    personId: string;
    specialty: string;
    licenseNumber?: string;
    createdAt: Date;
}
