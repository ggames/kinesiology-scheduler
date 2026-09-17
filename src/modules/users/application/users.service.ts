import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();
    return this.userRepository.findOne({ where: { email: normalizedEmail } });
  }

  // Helper method used for seeding/registration
  async create(email: string, passwordPlain: string, role = 'PATIENT'): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);
    const user = this.userRepository.create({ email, passwordHash, role });
    return this.userRepository.save(user);
  }
}
