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
        if (await this.findOneBy(user.username)) throw new ConflictException('Duplicate username');
        await this.userRepository.insert(user);
    }

    async findOneBy(username: string): Promise<User> {
        return await this.userRepository.findOneBy({ username });
    }
}
