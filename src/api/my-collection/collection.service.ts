import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageUtil } from 'src/util/page.util';
import { Repository } from 'typeorm';
import { Page } from '../common/page/page.dto';
import { SearchOption } from '../common/search/option.dto';
import { Order } from '../common/search/search.type';
import { SortAscending, SortBy } from '../common/search/sort.enum';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { UpdateCollectionDto } from './dto/updateCollection.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>
    ) {}

    private getSortElement(
        sortAscending: SortAscending,
        sortBy: SortBy
    ): { order: Order; column: string } {
        const order = sortAscending === SortAscending.ASC ? 'ASC' : 'DESC';
        let column: string;
        switch (sortBy) {
            case SortBy.NAME:
                column = 'name';
                break;
            case SortBy.CREATED_DATE:
                column = 'createdAt';
                break;
        }
        return { order, column };
    }

    async create(user: User, dto: UpdateCollectionDto): Promise<Collection> {
        const collection = this.collectionRepository.create({ ...dto, author: user });
        await this.collectionRepository.save(collection);
        return collection;
    }

    async findAll(options: SearchOption): Promise<Page<Collection>> {
        const { order, column } = this.getSortElement(options.sortAscending, options.sortBy);
        const queryBuilder = this.collectionRepository
            .createQueryBuilder('collection')
            .orderBy(column, order)
            .skip(options.skip)
            .take(options.take);
        return await new PageUtil<Collection>().getResponse(queryBuilder, options);
    }

    async findByUserId(authorId: number, options: SearchOption): Promise<Page<Collection>> {
        const { order, column } = this.getSortElement(options.sortAscending, options.sortBy);
        const queryBuilder = this.collectionRepository
            .createQueryBuilder('collection')
            .where('authorId = :authorId', { authorId })
            .orderBy(column, order)
            .skip(options.skip)
            .take(options.take);
        return await new PageUtil<Collection>().getResponse(queryBuilder, options);
    }

    async findOneById(collectionId: number): Promise<Collection> {
        return await this.collectionRepository.findOne({ where: { id: collectionId } });
    }

    async updateOne(
        user: User,
        collectionId: number,
        dto: UpdateCollectionDto
    ): Promise<Collection> {
        const collection = await this.findOneById(collectionId);
        if (!collection.isAuthor(user.id)) throw new BadRequestException('Invalid author');

        if (dto.name) collection.name = dto.name;
        if (dto.description) collection.description = dto.description;
        return await this.collectionRepository.save(collection);
    }

    async deleteOneById(collectionId: number): Promise<void> {
        await this.collectionRepository.delete({ id: collectionId });
    }

    async deleteOneByUserId(user: User, collectionId: number): Promise<void> {
        await this.collectionRepository.delete({ id: collectionId, authorId: user.id });
    }
}
