import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageMetaDto } from '../common/dto/page-meta.dto';
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

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMeta = new PageMetaDto(options, itemCount);

        return new PageDto(entities, pageMeta);
    }

    async findByUserId(authorId: number, options: PageOptionDto): Promise<PageDto<Collection>> {
        const queryBuilder = this.collectionRepository.createQueryBuilder('collection');
        queryBuilder
            .where('authorId = :authorId', { authorId })
            .skip(options.skip)
            .take(options.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMeta = new PageMetaDto(options, itemCount);

        return new PageDto(entities, pageMeta);
    }

    async findOneById(collectionId: number): Promise<Collection> {
        return await this.collectionRepository.findOneBy({ id: collectionId });
    }
}
