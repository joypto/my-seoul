import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageUtil } from 'src/util/page.util';
import { Repository } from 'typeorm';
import { PageOption } from '../common/page/option.dto';
import { Page } from '../common/page/page.dto';
import { User } from '../user/user.entity';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>
    ) {}

    async create(user: User, dto: CreateBookmarkDto): Promise<void> {
        const bookmark = this.bookmarkRepository.create({ userId: user.id, ...dto });
        await this.bookmarkRepository.save(bookmark);
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
        await this.bookmarkRepository.delete({ userId: user.id, collectionId });
    }
}
