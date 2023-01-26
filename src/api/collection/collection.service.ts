import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageUtil } from 'src/util/page.util';
import { Repository } from 'typeorm';
import { PageOptionDto } from '../common/dto/page-option.dto';
import { PageDto } from '../common/dto/page.dto';
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
        const collection = this.collectionRepository.create({ ...dto, author: user });
        await this.collectionRepository.save(collection);
        return collection;
    }

    async findAll(options: PageOptionDto): Promise<PageDto<Collection>> {
        const queryBuilder = this.collectionRepository.createQueryBuilder('collection');
        queryBuilder.skip(options.skip).take(options.take);

        return await new PageUtil<Collection>().getResponse(queryBuilder, options);
    }

    async findByUserId(authorId: number, options: PageOptionDto): Promise<PageDto<Collection>> {
        const queryBuilder = this.collectionRepository.createQueryBuilder('collection');
        queryBuilder
            .where('authorId = :authorId', { authorId })
            .skip(options.skip)
            .take(options.take);

        return await new PageUtil<Collection>().getResponse(queryBuilder, options);
    }

    async findOneById(collectionId: number): Promise<Collection> {
        return await this.collectionRepository.findOneBy({ id: collectionId });
    }

    async updateOne(user: User, collectionId: number, dto: CollectionDto): Promise<Collection> {
        const collection = await this.findOneById(collectionId);
        if (!collection.isAuthor(user.id)) throw new BadRequestException('Invalid author');

        if (dto.name) collection.name = dto.name;
        if (dto.description) collection.description = dto.description;
        return await this.collectionRepository.save(collection);
    }

    async deleteOne(user: User, collectionId: number): Promise<void> {
        await this.collectionRepository.delete({ id: collectionId, authorId: user.id });
    }
}
