import { DataSource } from 'typeorm';
export declare class AppointmentExpirationTask {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    handleExpiration(): Promise<void>;
}
