import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageUtil } from 'src/util/page.util';
import { Repository } from 'typeorm';
import { PageOption } from '../common/page/option.dto';
import { Page } from '../common/page/page.dto';
import { User } from '../user/user.entity';
import { Collection } from './collection.entity';
import { UpdateCollectionDto } from './dto/updateCollection.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>
    ) {}

    async create(user: User, dto: UpdateCollectionDto): Promise<Collection> {
        const collection = this.collectionRepository.create({ ...dto, author: user });
        await this.collectionRepository.save(collection);
        return collection;
    }

    async findAll(options: PageOption): Promise<Page<Collection>> {
        const queryBuilder = this.collectionRepository.createQueryBuilder('collection');
        queryBuilder.skip(options.skip).take(options.take);

        return await new PageUtil<Collection>().getResponse(queryBuilder, options);
    }

    async findByUserId(authorId: number, options: PageOption): Promise<Page<Collection>> {
        const queryBuilder = this.collectionRepository.createQueryBuilder('collection');
        queryBuilder
            .where('authorId = :authorId', { authorId })
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

    async deleteOne(user: User, collectionId: number): Promise<void> {
        await this.collectionRepository.delete({ id: collectionId, authorId: user.id });
    }
}
