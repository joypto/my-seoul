import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { CollectionDto } from './dto/basic.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>
    ) {}

    async create(user: User, dto: CollectionDto): Promise<Collection> {
        const collection = this.collectionRepository.create({ ...dto, user });
        await this.collectionRepository.save(collection);
        return collection;
    }

    async findAll(): Promise<Collection[]> {
        return await this.collectionRepository.find();
    }

    async findById(collectionId: number): Promise<Collection[]> {
        return await this.collectionRepository.findBy({ id: collectionId });
    }

    async findByUserId(userId: number): Promise<Collection[]> {
        return await this.collectionRepository.findBy({ userId });
    }
}
