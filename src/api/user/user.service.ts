import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(user: User): Promise<void> {
        if (await this.findOneByUsername(user.username))
            throw new ConflictException('Duplicate username');
        await this.userRepository.insert(user);
    }

    async findOneById(userId: number): Promise<User> {
        return await this.userRepository.findOneBy({ id: userId });
    }

    async findOneByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneBy({ username });
    }

    async updateUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
