import { PersonsService } from '../application/persons.service';
import { CreatePersonDto, UpdatePersonDto } from '../application/dto/create-person.dto';
export declare class PersonsController {
    private readonly service;
    constructor(service: PersonsService);
    create(dto: CreatePersonDto): Promise<import("../domain/person.entity").Person>;
    findAll(): Promise<import("../domain/person.entity").Person[]>;
    findOne(id: string): Promise<import("../domain/person.entity").Person>;
    update(id: string, dto: UpdatePersonDto): Promise<import("../domain/person.entity").Person>;
    remove(id: string): Promise<void>;
}
