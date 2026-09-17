import { ResourcesService } from '../application/resources.service';
import { CreateResourceDto } from '../application/dto/create-resource.dto';
export declare class ResourcesController {
    private readonly service;
    constructor(service: ResourcesService);
    create(dto: CreateResourceDto): Promise<import("../domain/resource.entity").Resource>;
    findAll(): Promise<import("../domain/resource.entity").Resource[]>;
}
