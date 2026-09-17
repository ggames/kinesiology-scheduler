import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    create(email: string, passwordPlain: string, role?: string): Promise<User>;
}
