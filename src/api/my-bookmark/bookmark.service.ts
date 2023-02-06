import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { PageUtil } from 'src/util/page.util';
import { DataSource, Repository } from 'typeorm';
import { PageOption } from '../common/page/option.dto';
import { Page } from '../common/page/page.dto';
import { Collection } from '../my-collection/collection.entity';
import { User } from '../user/user.entity';
import { Bookmark } from './bookmark.entity';
import { CreateBookmarkDto } from './dto/createBookmark.dto';

@Injectable()
export class BookmarkService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>
    ) {}

    async create(user: User, dto: CreateBookmarkDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            // save bookmark
            await queryRunner.manager.save(
                Bookmark,
                Builder(Bookmark).userId(user.id).collectionId(dto.collectionId).build()
            );
            // increase bookmark count
            await queryRunner.manager
                .createQueryBuilder()
                .update(Collection)
                .where('id = :collectionId', { collectionId: dto.collectionId })
                .set({ bookmarkCount: () => 'bookmarkCount + 1' })
                .execute();
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new ConflictException('Duplicate bookmark');
        } finally {
            await queryRunner.release();
        }
    }

    async findCollections(userId: number, options: PageOption): Promise<Page<Bookmark>> {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');
        queryBuilder
            .leftJoinAndSelect('bookmark.collection', 'collection')
            .where('userId = :userId', { userId })
            .skip(options.skip)
            .take(options.take);
        return await new PageUtil<Bookmark>().getResponse(queryBuilder, options);
    }

    async findUsers(collectionId: number, options: PageOption): Promise<Page<Bookmark>> {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');
        queryBuilder
            .leftJoinAndSelect('bookmark.user', 'user')
            .where('collectionId = :collectionId', { collectionId })
            .skip(options.skip)
            .take(options.take);
        return await new PageUtil<Bookmark>().getResponse(queryBuilder, options);
    }

    async deleteOne(user: User, collectionId: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            // delete bookmark
            const { affected } = await queryRunner.manager.delete(
                Bookmark,
                Builder(Bookmark).userId(user.id).collectionId(collectionId).build()
            );
            if (affected === 0) throw new NotFoundException('Bookmark Not found');
            // decrease bookmark count
            await queryRunner.manager
                .createQueryBuilder()
                .update(Collection)
                .where('id = :collectionId', { collectionId: collectionId })
                .set({ bookmarkCount: () => 'bookmarkCount - 1' })
                .execute();
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
