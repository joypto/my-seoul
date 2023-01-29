import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../admin/role/role.enum';
import { User } from '../user/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(user: User): Promise<void> {
        if (await this.findOneByUsername(user.username)) {
            throw new ConflictException('Duplicate username');
        }
        if (await this.findOneByEmail(user.email)) {
            throw new ConflictException('Duplication email');
        }
        await this.userRepository.insert(user);
    }

    async findOneById(userId: number): Promise<User> {
        return await this.userRepository.findOneBy({ id: userId });
    }

    async findOneByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneBy({ username });
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email });
    }

    async findRolesCount(role: Role): Promise<number> {
        return this.userRepository
            .createQueryBuilder('user')
            .where('roles = :role', { role })
            .getCount();
    }

    async updateOne(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
